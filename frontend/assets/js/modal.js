export default function showStatusModal(status, msg) {
  // Create overlay and modal elements
  const overlay = document.createElement('div');
  const modal = document.createElement('div');
  const iconContainer = document.createElement('div');
  const message = document.createElement('div');

  // Create SVG based on status
  let svgContent;
  if (status === 'success') {
    svgContent = `
            <svg viewBox="0 0 100 100" class="status-icon">
                <circle cx="50" cy="50" r="45" fill="#4CAF50" class="circle"/>
                <path d="M30,50 l15,20 l25,-35" fill="none" stroke="#FFF" stroke-width="8" 
                      stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" class="check"/>
            </svg>
        `;
    message.textContent = msg ? msg : "success";
  } else {
    svgContent = `
            <svg viewBox="0 0 100 100" class="status-icon">
                <circle cx="50" cy="50" r="45" fill="#F44336" class="circle"/>
                <line x1="30" y1="30" x2="70" y2="70" stroke="#FFF" stroke-width="8" 
                      stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" class="line1"/>
                <line x1="70" y1="30" x2="30" y2="70" stroke="#FFF" stroke-width="8" 
                      stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" class="line2"/>
            </svg>
        `;
    message.textContent = msg ? msg : 'Failed!';
  }

  // Set element attributes
  overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

  modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 30px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.4s ease;
    `;

  iconContainer.style.cssText = `
        width: 150px;
        height: 150px;
        margin: 0 auto 15px;
    `;

  message.style.cssText = `
        font-family: Arial, sans-serif;
        font-size: 24px;
        font-weight: bold;
        color: ${status === 'success' ? '#4CAF50' : '#F44336'};
    `;

  // Add elements to DOM
  iconContainer.innerHTML = svgContent;
  modal.appendChild(iconContainer);
  modal.appendChild(message);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Trigger animations
  setTimeout(() => {
    overlay.style.opacity = 1;
    modal.style.opacity = 1;
    modal.style.transform = 'translateY(0)';
  }, 10);

  // Anate SVG elements
  setTimeout(() => {
    const circle = modal.querySelector('.circle');
    const check = modal.querySelector('.check');
    const line1 = modal.querySelector('.line1');
    const line2 = modal.querySelector('.line2');

    if (circle) {
      circle.style.animation = 'scaleIn 0.4s forwards';
    }
    if (check) {
      check.style.animation = 'draw 0.6s 0.4s forwards';
    }
    if (line1 && line2) {
      line1.style.animation = 'draw 0.4s 0.4s forwards';
      line2.style.animation = 'draw 0.4s 0.6s forwards';
    }
  }, 50);

  // Create dynamic styles
  const style = document.createElement('style');
  style.textContent = `
        @keyframes scaleIn {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        @keyframes draw {
            to { stroke-dashoffset: 0; }
        }
        .status-icon .circle {
            opacity: 0;
            transform-origin: center;
        }
        .status-icon .check,
        .status-icon .line1,
        .status-icon .line2 {
            stroke-dashoffset: 100;
        }
    `;
  document.head.appendChild(style);

  // Remove modal after 1 second
  setTimeout(() => {
    overlay.style.opacity = 0;
    setTimeout(() => {
      document.body.removeChild(overlay);
      document.head.removeChild(style);
    }, 300);
  }, 1000);
}
