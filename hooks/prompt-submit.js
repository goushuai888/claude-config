#!/usr/bin/env node
/**
 * UserPromptSubmit Hook - 用户提交问题时执行
 * 功能：强制评估技能，提高技能激活率
 */

const skills = [
  { name: 'crud-development', desc: 'CRUD/业务模块开发', keywords: ['增删改查', 'CRUD', '列表', '表单', '模块'] },
  { name: 'api-development', desc: 'API设计/RESTful规范', keywords: ['API', '接口', 'RESTful', '请求', '响应'] },
  { name: 'database-ops', desc: '数据库/SQL/建表', keywords: ['数据库', 'SQL', '表', '字段', '索引', 'MySQL'] },
  { name: 'ui-pc', desc: 'PC端组件/AForm/AModal', keywords: ['表单', '弹窗', 'Modal', 'Table', '组件', 'Ant'] },
  { name: 'ui-mobile', desc: '移动端/WD UI组件', keywords: ['移动端', '小程序', 'H5', 'APP'] },
  { name: 'auth-security', desc: '认证/授权/安全', keywords: ['登录', '权限', '认证', '授权', 'Token', 'JWT'] },
  { name: 'testing', desc: '单元测试/集成测试', keywords: ['测试', 'test', 'jest', '单元', '集成'] },
  { name: 'deployment', desc: '部署/CI/CD', keywords: ['部署', 'deploy', 'CI', 'CD', 'Docker'] },
  { name: 'refactoring', desc: '代码重构/优化', keywords: ['重构', '优化', '整理', '改进'] },
  { name: 'debugging', desc: '调试/问题排查', keywords: ['调试', 'debug', '报错', '错误', '问题', 'bug'] },
  { name: 'documentation', desc: '文档编写', keywords: ['文档', '注释', 'README', '说明'] },
  { name: 'code-review', desc: '代码审查', keywords: ['review', '审查', '检查'] },
  { name: 'performance', desc: '性能优化', keywords: ['性能', '优化', '缓慢', '卡顿'] },
  { name: 'data-migration', desc: '数据迁移', keywords: ['迁移', '导入', '转换'] },
  { name: 'third-party-integration', desc: '第三方集成', keywords: ['第三方', '集成', '对接', 'SDK'] },
  { name: 'config-management', desc: '配置管理', keywords: ['配置', 'config', '环境变量'] },
  { name: 'logging-monitoring', desc: '日志/监控', keywords: ['日志', 'log', '监控'] },
  { name: 'caching', desc: '缓存策略', keywords: ['缓存', 'cache', 'Redis'] },
  { name: 'file-handling', desc: '文件处理/上传下载', keywords: ['文件', '上传', '下载', '导出'] },
  { name: 'search', desc: '搜索功能', keywords: ['搜索', '查询', '筛选'] },
  { name: 'notification', desc: '通知/消息推送', keywords: ['通知', '消息', '推送'] },
  { name: 'scheduling', desc: '定时任务/调度', keywords: ['定时', '调度', 'cron'] },
  { name: 'export-import', desc: '导入导出功能', keywords: ['导入', '导出', 'Excel', 'CSV'] },
  { name: 'workflow', desc: '工作流/审批流', keywords: ['工作流', '审批', '流程'] },
  { name: 'multi-tenant', desc: '多租户', keywords: ['多租户', '租户', '隔离'] },
  { name: 'i18n', desc: '国际化', keywords: ['国际化', 'i18n', '多语言'] }
];

const instructions = `## 技能激活评估（请根据用户问题判断）

请快速扫描以下技能，判断哪些与当前任务相关：

| 技能 | 描述 |
|------|------|
${skills.map(s => `| ${s.name} | ${s.desc} |`).join('\n')}

**评估方式**: 如果任务涉及以上任何技能领域，请使用 \`Skill\` 工具激活对应技能以获取专业指导。

---`;

console.log(instructions);
