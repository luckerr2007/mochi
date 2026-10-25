// 仓库历史提交风格是 "Form: xxx" / "chore(worklog): xxx" 混用——
// 只强制最小结构（type + 标题 + 长度），不锁 type 枚举，历史与新提交都过
export default {
  rules: {
    'header-max-length': [2, 'always', 120],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'type-case': [0],
  },
}
