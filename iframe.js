class IframeExtension {
  constructor() {
    this.iframeId = 'customIframe'; // 用于标识 iframe 的唯一 ID
  }

  getInfo() {
    return {
      id: 'iframeTools',
      name: 'Iframe 窗口工具',
      color1: '#4B8BBE',
      blocks: [
        {
          opcode: 'createIframe',
          blockType: Scratch.BlockType.COMMAND,
          text: '创建 iframe 窗口 URL [URL]',
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://example.com'
            }
          }
        },
        {
          opcode: 'removeIframe',
          blockType: Scratch.BlockType.COMMAND,
          text: '删除 iframe 窗口'
        }
      ]
    };
  }

  createIframe(args) {
    // 先移除已存在的 iframe
    this.removeIframe();

    // 创建新的 iframe 元素
    const iframe = document.createElement('iframe');
    iframe.id = this.iframeId;
    iframe.style.position = 'fixed';
    iframe.style.top = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';
    iframe.style.height = '300px';
    iframe.style.border = '2px solid #4B8BBE';
    iframe.style.borderRadius = '8px';
    iframe.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    iframe.src = args.URL;

    // 将 iframe 添加到页面
    document.body.appendChild(iframe);
  }

  removeIframe() {
    const existingIframe = document.getElementById(this.iframeId);
    if (existingIframe) {
      existingIframe.parentNode.removeChild(existingIframe);
    }
  }
}

Scratch.extensions.register(new IframeExtension());