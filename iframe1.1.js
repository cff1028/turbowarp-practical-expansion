class UniversalIframeExtension {
  constructor() {
    this.iframeId = 'universalIframe';
    this.retryCount = 0;
    this.maxRetries = 50; // 最多尝试50次（约5秒）
  }

  getInfo() {
    return {
      id: 'universalIframe',
      name: '通用 Iframe',
      color1: '#2B8CC4',
      blocks: [
        {
          opcode: 'safeCreateIframe',
          blockType: Scratch.BlockType.COMMAND,
          text: '安全创建窗口 URL [URL] 宽度 [WIDTH] 高度 [HEIGHT]',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://turbowarp.org'
            },
            WIDTH: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 300
            },
            HEIGHT: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 200
            }
          }
        },
        {
          opcode: 'safeRemoveIframe',
          blockType: Scratch.BlockType.COMMAND,
          text: '安全删除窗口'
        }
      ]
    };
  }

  safeCreateIframe(args) {
    this.safeRemoveIframe();
    
    // 异步查找舞台容器
    const findContainer = () => {
      try {
        // 方法1：通过 Scratch VM 获取
        if (typeof Scratch !== 'undefined' && Scratch.vm?.runtime?.renderer?.canvas) {
          const canvas = Scratch.vm.runtime.renderer.canvas;
          return canvas.parentElement;
        }
        
        // 方法2：通过 DOM 特征查找（兼容非TurboWarp环境）
        const candidates = document.querySelectorAll('canvas');
        for (const canvas of candidates) {
          if (canvas.width === 408 && canvas.height === 306) {
            return canvas.parentElement;
          }
        }
        
        // 方法3：通过常见类名查找
        return document.querySelector('.stage-wrapper, .guiPlayer, .player') 
               || document.body;
      } catch (error) {
        return document.body; // 终极回退方案
      }
    };

    // 重试机制
    const tryCreate = () => {
      this.retryCount++;
      const container = findContainer();
      
      if (container) {
        const iframe = document.createElement('iframe');
        iframe.id = this.iframeId;
        iframe.style.cssText = `
          position: absolute;
          width: ${args.WIDTH}px;
          height: ${args.HEIGHT}px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border: 2px solid ${this.getInfo().color1};
          z-index: 9999;
        `;
        iframe.src = args.URL;
        
        // 确保容器有定位上下文
        if (getComputedStyle(container).position === 'static') {
          container.style.position = 'relative';
        }
        
        container.appendChild(iframe);
      } else if (this.retryCount < this.maxRetries) {
        setTimeout(tryCreate, 100); // 每100ms重试一次
      }
    };

    tryCreate();
  }

  safeRemoveIframe() {
    const iframe = document.getElementById(this.iframeId);
    if (iframe) iframe.remove();
    this.retryCount = 0;
  }
}

Scratch.extensions.register(new UniversalIframeExtension());
