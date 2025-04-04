class IframeExtension {
  constructor() {
    this.iframeId = 'twIframe';
    this.stageContainer = null;
  }

  getInfo() {
    return {
      id: 'iframeStage',
      name: '舞台 Iframe',
      color1: '#2B8CC4',
      blocks: [
        {
          opcode: 'createIframe',
          blockType: Scratch.BlockType.COMMAND,
          text: '创建窗口 URL [URL] 宽度 [WIDTH] 高度 [HEIGHT] 中心X [X] 中心Y [Y]',
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
            },
            X: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 50
            },
            Y: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 50
            }
          }
        },
        {
          opcode: 'removeIframe',
          blockType: Scratch.BlockType.COMMAND,
          text: '删除窗口'
        }
      ]
    };
  }

  createIframe(args) {
    this.removeIframe();
    
    try {
      // 通过渲染器获取舞台 canvas
      const canvas = Scratch.vm.runtime.renderer.canvas;
      this.stageContainer = canvas.parentElement;
      
      // 设置舞台容器定位上下文
      const containerStyle = getComputedStyle(this.stageContainer);
      if (containerStyle.position === 'static') {
        this.stageContainer.style.position = 'relative';
      }

      // 创建 iframe
      const iframe = document.createElement('iframe');
      iframe.id = this.iframeId;
      iframe.style.cssText = `
        position: absolute;
        width: ${args.WIDTH}px;
        height: ${args.HEIGHT}px;
        left: ${args.X}%;
        top: ${args.Y}%;
        transform: translate(-${args.X}%, -${args.Y}%);
        border: 2px solid ${this.getInfo().color1};
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        background: white;
        z-index: 9999;
      `;
      iframe.src = args.URL;

      this.stageContainer.appendChild(iframe);
    } catch (error) {
      console.error('创建 iframe 失败:', error);
    }
  }

  removeIframe() {
    const iframe = this.stageContainer?.querySelector(`#${this.iframeId}`);
    if (iframe) iframe.remove();
  }
}

Scratch.extensions.register(new IframeExtension());