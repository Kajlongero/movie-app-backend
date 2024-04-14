const codeStructure = (structure, code) => {
  const { to, subject, text, message } = structure;

  return {
    to,
    subject,
    text,
    html: `
    <head>
      <style>
      p,
      h2 {
        margin: 0;
        padding: 0;
      }
      .container {
        color: white;
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #1a1a1a;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        gap: 1rem;
      }
      .sub-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 1rem 1.5rem;
      }
      .code-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
        text-align: center;
      }
      .title {
        text-align: center;
      }
      .subject {
        margin-top: 0.5rem;
      }
      .code-container {
        background-color: #0a0a0a;
        border-radius: 0.5rem;
        padding: 1rem 0.5rem;
        width: 100%;
        margin-top: 2remb;
      }
      .code {
        letter-spacing: 1rem;
        font-size: 2rem;
      }
      .post-message {
        margin-top: 0.75rem;
        font-size: 0.6rem;
      }
      </style>
    </head>
    <div class="container">
      <div class="sub-container">
        <h2 class="title">Rotten Tomatoes App Clon</h2>
        <p class="subject">${message}</p>
        <div class="code-container">
          <p class="code">${code}</p>
        </div>
        <p class="post-message">
          If you do not request this code please ignore it
        </p>
      </div>
    </div>
    `,
  };
};

module.exports = codeStructure;
