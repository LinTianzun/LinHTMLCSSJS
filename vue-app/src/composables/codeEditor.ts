/**
 * CodeMirror 6 编辑器挂载（全部动态 import）：
 * 语言包/主题只在进入创作页时才按需加载，
 * 避免 ~570KB 的 CodeMirror 被打进 CreateView 的路由 chunk。
 */

export interface MountedEditor {
  setDoc(text: string): void
  requestMeasure(): void
  destroy(): void
}

export async function mountCodeEditor(opts: {
  host: HTMLElement
  lang: 'html' | 'css' | 'js'
  get: () => string
  set: (v: string) => void
}): Promise<MountedEditor> {
  const [{ EditorView, basicSetup }, { oneDark }, htmlMod, cssMod, jsMod] = await Promise.all([
    import('codemirror'),
    import('@codemirror/theme-one-dark'),
    import('@codemirror/lang-html'),
    import('@codemirror/lang-css'),
    import('@codemirror/lang-javascript'),
  ])

  const lang =
    opts.lang === 'html'
      ? htmlMod.html()
      : opts.lang === 'css'
        ? cssMod.css()
        : jsMod.javascript()

  const view = new EditorView({
    doc: opts.get(),
    extensions: [
      basicSetup,
      lang,
      oneDark,
      EditorView.lineWrapping,
      EditorView.updateListener.of((u) => {
        if (u.docChanged) opts.set(u.state.doc.toString())
      }),
    ],
    parent: opts.host,
  })

  return {
    setDoc(text: string) {
      view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } })
    },
    requestMeasure: () => view.requestMeasure(),
    destroy: () => view.destroy(),
  }
}
