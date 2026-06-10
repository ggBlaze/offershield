import type { Dictionary } from "../dictionaries";

export const zh: Dictionary = {
  meta: {
    title: "OfferShield — 签署之前,先读懂合同",
    description:
      "OfferShield 把冗长的法律文本转换成通俗易懂的摘要、风险提示、双方义务清单,以及签署前值得提出的问题。用 MiniMax-M3 用心打造。",
  },
  nav: {
    howItWorks: "使用流程",
    features: "功能",
    disclaimer: "免责声明",
    status: "状态",
  },
  hero: {
    badge: "AI 驱动的合同解读工具",
    h1Before: "签署之前,",
    h1Highlight: "先读懂合同。",
    subhead:
      "OfferShield 把冗长的法律文本转换成通俗的中文摘要、风险提示、双方义务清单,以及值得提出的问题 — ",
    subheadHighlight: "用 MiniMax-M3 用心打造",
    ctaPrimary: "试试示例",
    ctaSecondary: "粘贴你的文档",
    private: "默认私密 — 文本仅用于生成你的报告",
    educational: "仅供参考,不是法律建议",
  },
  howItWorks: {
    tag: "使用流程",
    title: "三步完成,大约一分钟。",
    steps: [
      {
        title: "粘贴或上传",
        body:
          "粘贴合同、Offer、NDA 或任何文档的文本,也可以上传 PDF,或者直接试试内置示例。",
      },
      {
        title: "点击分析",
        body:
          "OfferShield 会阅读文档,识别关键条款,并在几秒钟内标出风险。",
      },
      {
        title: "阅读报告",
        body:
          "获得通俗易懂的解读、风险提示、双方义务清单,以及签署前应提出的问题。",
      },
    ],
  },
  features: {
    tag: "你能得到",
    title: "帮助你做出更好的决定。",
    items: [
      {
        title: "通俗易懂的中文解读",
        body: "用平实语言讲清合同到底说了什么 — 远离法律术语。",
      },
      {
        title: "可操作的风险提示",
        body:
          "对每条风险按严重程度配色,并指出它来自合同中的哪一条具体条款。",
      },
      {
        title: "关键日期与义务",
        body: "期限、续约触发点、各方应承担的责任 — 一目了然。",
      },
      {
        title: "签署前应提出的问题",
        body: "一份可一键复制的清单,直接发给对方或你的律师。",
      },
      {
        title: "支持多种文档类型",
        body: "Offer、NDA、自由职业合同、SaaS 条款、供应商协议等等。",
      },
      {
        title: "默认私密",
        body: "你的文本仅用于生成报告,不会保存。",
      },
    ],
  },
  trust: {
    items: [
      {
        title: "默认私密",
        body: "文档文本仅发送给模型用于生成你的报告,不会保存。",
      },
      {
        title: "服务端 AI",
        body: "所有分析在服务端运行。即使你配置了 API Key,它也永远不会进入浏览器。",
      },
      {
        title: "无需注册",
        body: "打开即可使用,无需账号、无需邮箱、零摩擦。",
      },
    ],
  },
  disclaimer: {
    title: "OfferShield 提供的是教育性信息,而非法律建议。",
    body:
      "你收到的分析由 AI 生成,旨在帮助你理解一份文档,而不是替代合格的律师。具体事实 — 你的司法管辖地、对方的行为习惯以及合同的完整背景 — 都可能改变每条条款在实践中的含义。任何有重大影响的决定,请咨询你所在司法管辖区的执业律师。",
  },
  footer: {
    copyright: (year: number) => `© ${year} OfferShield`,
    by: "由",
    creditAria: "Blaze 在 X 上(在新标签页打开)",
    builtWith: "用心打造",
    using: "使用",
    model: "MiniMax-M3",
  },
  analyzer: {
    trust: "默认私密 · 不存储 · 仅用于生成你的报告",
    tabs: {
      paste: "粘贴文本",
      upload: "上传 PDF",
      sample: "试试示例",
    },
    paste: {
      placeholder: "在此粘贴你的合同、Offer、NDA 或任何文档……",
      charCounter: (count: number, max: number) =>
        `${count.toLocaleString("zh-CN")} / ${max.toLocaleString("zh-CN")} 字符`,
      charCounterWithMeta: (count: number, max: number, words: number, mins: number) =>
        `${count.toLocaleString("zh-CN")} / ${max.toLocaleString("zh-CN")} 字符 · ${words.toLocaleString("zh-CN")} 词 · 约 ${mins} 分钟阅读`,
      tooShort: (min: number) => `再多粘贴一些 — 至少 ${min} 个字符。`,
      tooLong: (max: number) =>
        `太长了,请精简到 ${max.toLocaleString("zh-CN")} 字符以内。`,
    },
    upload: {
      dropZone: "将 PDF 拖到此处,或点击选择",
      replace: "更换文件",
      hint: "最大 4.5 MB,文本型 PDF 效果最佳。",
      tooLarge: "文件过大,请保持在 4.5 MB 以内。",
      wrongType: "请选择 PDF 文件。",
      removeFile: "移除文件",
    },
    sample: {
      prompt: "选一个示例体验 OfferShield — 无需上传,无需粘贴。",
      loaded: "示例已加载,可以开始分析了。",
    },
    button: {
      analyze: "分析文档",
      analyzing: "分析中…",
    },
    inline: "OfferShield 提供的是教育性信息,而非法律建议。",
  },
  analyzing: {
    messages: [
      "正在阅读你的文档…",
      "正在识别关键条款…",
      "正在标出风险…",
      "正在梳理双方义务…",
      "正在起草应提出的问题…",
      "正在计算风险评分…",
    ],
    etaPrefix: "预计还需",
    etaAbout: "约 1 分钟",
    etaSeconds: (n: number) => `${n} 秒`,
    etaFinishing: "即将完成…",
  },
  errorState: {
    title: "出现了一些问题",
    retry: "重试",
  },
  report: {
    heading: {
      tag: "你的报告",
      title: "签署之前先读一遍",
      generatedBy: "由 OfferShield 生成",
    },
    risk: {
      tag: "整体风险",
      outOf: (score: number) => ` / 100`,
    },
    exec: {
      tag: "执行摘要",
      fallback: "合同",
    },
    plain: {
      tag: "通俗解读",
      title: "签署之前先读一遍",
    },
    clauses: {
      tag: "关键条款",
      title: "主要条款的实际作用",
    },
    redFlags: {
      tag: "风险提示",
      title: "值得再看一眼",
      emptyTitle: "未发现重大风险",
      emptyBody:
        "根据本次分析,文档中并未包含需要特别警惕的条款。但你仍应通读协议,并就任何不完全理解的地方考虑咨询律师。",
    },
    obligations: {
      tag: "义务清单",
      title: "谁该做什么",
      you: "你的义务",
      counterparty: "对方义务",
      mutual: "共同义务",
    },
    payment: {
      tag: "报酬与付款",
      title: "钱的部分",
      amount: "金额",
      schedule: "付款节奏",
      lateFees: "逾期费用",
      notes: "备注",
    },
    termination: {
      tag: "终止与续约",
      title: "这份协议怎么结束",
      notice: "提前通知",
      renewal: "续约",
      cancellation: "取消",
      notes: "备注",
    },
    deadlines: {
      tag: "期限与重要日期",
      title: "这些日期别错过",
    },
    missing: {
      tag: "缺失的保护条款",
      title: "这份协议没有覆盖到的内容",
    },
    ambiguous: {
      tag: "含糊的措辞",
      title: "值得澄清的措辞",
      why: "为什么不够清楚:",
    },
    questions: {
      tag: "应提出的问题",
      title: "签署之前",
      copy: "全部复制",
      copied: "已复制",
      copyAria: "复制全部问题",
    },
    negotiation: {
      tag: "谈判机会",
      title: "可以争取的具体事项",
    },
    confidence: {
      tag: "置信度与提示",
      title: "对这份结果可以信多少",
      educational: "仅供参考,非法律建议",
    },
    disclaimer: {
      title: "OfferShield 提供的是教育性信息,而非法律建议。",
      body:
        "以上分析由 AI 生成,旨在帮助你理解一份文档,而非替代律师。任何有重大影响的决定,请咨询你所在司法管辖区的执业律师。",
    },
    documentType: (t: string) => `${t} · 置信度:`,
  },
};
