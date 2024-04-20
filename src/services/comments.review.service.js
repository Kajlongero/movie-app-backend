const { notFound } = require("@hapi/boom");
const prisma = require("../connections/prisma");
const authService = require("./auth.service");
const filmsService = require("./films.service");
const { forbidden } = require("joi");

class CommentsReviewService {
  async getCommentsByFilmId(filmId, offset = 0) {
    const parsed = parseInt(filmId);
    const parsedOffset = parseInt(offset);

    const existFilm = await filmsService.existFilm(parsed);
    if (!existFilm) throw new notFound("Film not found");

    console.log(filmId);
    console.log(parsedOffset);

    const getAssociated = await prisma.commentsReview.findMany({
      skip: parsedOffset ?? 0,
      take: 30,
      where: {
        filmId: parsed,
      },
      include: {
        User: true,
      },
    });

    return getAssociated;
  }

  async getCommentHistory(commentId, offset) {
    const commentExist = await this.getUniqueComment(commentId);

    const findHistory = await prisma.commentsReviewHistory.findMany({
      take: 30,
      skip: offset ? offset : 0,
      where: {
        commentId: commentExist.id,
      },
    });

    return findHistory;
  }

  async getUniqueComment(commentId) {
    const uniqueComment = await prisma.commentsReview.findUnique({
      where: {
        id: parseInt(commentId),
      },
    });
    if (!uniqueComment) throw new notFound("Comment not found");

    return uniqueComment;
  }

  async getUserReviewOnFilm(user, filmId) {
    const uid = user.uid;
    const id = parseInt(filmId);

    try {
      const uniqueComment = await prisma.commentsReview.findFirst({
        where: {
          AND: [
            {
              userId: uid,
            },
            {
              filmId: id,
            },
          ],
        },
        include: {
          User: true,
        },
      });

      return uniqueComment;
    } catch (e) {
      console.log(e);
    }
  }

  async createCommentReview(user, data) {
    const { score, content } = data;

    if (score > 10 && score < 1)
      throw new badRequest("The score must be between 1 and 10");

    const existingUser = await authService.getUserById(user.uid);
    if (!existingUser)
      throw new unauthorized(
        "You do not have permissions to perform this action"
      );

    const filmId = parseInt(data.filmId);

    const existingFilm = await filmsService.existFilm(filmId);
    if (!existingFilm) throw new forbidden("The requested film does not exist");

    const createCommentReview = await prisma.commentsReview.create({
      data: {
        score: parseFloat(data.score),
        content: data.content,
        filmId: filmId,
        userId: user.uid,
      },
      include: {
        User: true,
      },
    });

    await filmsService.addNewFilmScore(filmId, createCommentReview);

    return createCommentReview;
  }

  async updateCommentReview(user, commentId, data) {
    const parsed = parseInt(commentId);
    const { content, score } = data;

    const findComment = await prisma.commentsReview.findUnique({
      where: {
        id: parsed,
      },
    });
    if (!findComment) throw new notFound("Comment not found");

    if (findComment.userId !== user.uid)
      throw new forbidden("You cannot perform this action");

    const updatedComment = await prisma.commentsReview.update({
      where: {
        id: parsed,
        userId: user.uid,
      },
      data: {
        score: score ? score : undefined,
        content: content ? content : undefined,
        CommentsReviewHistory: {
          create: {
            score: findComment.score,
            content: findComment.content,
            userId: user.uid,
          },
        },
      },
      include: {
        User: true,
      },
    });

    if (score)
      await filmsService.updateFilmScore(
        updatedComment.filmId,
        findComment,
        updatedComment
      );

    return updatedComment;
  }

  async deleteCommentReview(user, commentId) {
    const parsed = parseInt(commentId);

    const comment = await this.getUniqueComment(parsed);

    try {
      if (comment.userId !== user.uid) {
        throw new unauthorized(
          "You do not have permissions to perform this action"
        );
      }

      await prisma.$transaction([
        prisma.commentsReviewHistory.deleteMany({
          where: {
            commentId: comment.id,
          },
        }),
        prisma.commentsReview.delete({
          where: {
            id: comment.id,
          },
        }),
      ]);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }

    await filmsService.updateScoreByDecrement(comment.filmId, comment);

    return "deleted successfully";
  }
}

module.exports = new CommentsReviewService();
