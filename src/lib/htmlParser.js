export function parseHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    return {
      text: doc.body.textContent || '',
      image: doc.querySelector('img') ? doc.querySelector('img').src : '',
      font: window.getComputedStyle(doc.body).getPropertyValue('font-family'),
      backgroundColor: window.getComputedStyle(doc.body).getPropertyValue('background-color'),
      textColor: window.getComputedStyle(doc.body).getPropertyValue('color')
    };
  }
  
  export function generateHTML(parsedContent) {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: ${parsedContent.font};
              background-color: ${parsedContent.backgroundColor};
              color: ${parsedContent.textColor};
            }
          </style>
        </head>
        <body>
          ${parsedContent.image ? `<img src="${parsedContent.image}" alt="Preview">` : ''}
          <div>${parsedContent.text}</div>
        </body>
      </html>
    `;
  }