


module.exports = {

    base: '/',

    // 基础配置
    title: 'YOU CAN DO IT @ WANGU',
    head: [
        ['link', { rel: 'icon', href: `/favicon.ico` }]
    ],
    dest: './docs/.vuepress/dist',
    ga: '',
    evergreen: true,

    // markdown
    markdown: {
        // 行号显示
        lineNumbers: true
    },

    // 导航栏
    themeConfig:{


        // 显示所有页面的标题链接
        displayAllHeaders: true,

        // 导航
        nav : [{ 
                text: 'Java',
                items:[{
                    text: 'todo',
                    link: '/404'
                }]
            },{ 
                text: 'Spring', 
                items:[
                    { text: 'SpringBoot 集成 Activiti6', link: '/Spring/SpringBoot/SpringBoot2.0集成Activiti6/1-springboot-activit-star' },
                ]
            },{ 
                text: '中间件', 
                items:[
                    { text: 'RabbitMQ', link: '/中间件/RabbitMQ消息中间件/1-RabbitMQ-setup' },
                ]
            },{ 
                text: '翻过这座山', 
                items:[{ 
                    text: '第一阶段', 
                    items:[{
                        text: '持久层框架设计实现及MyBatis源码分析',
                        link: '/中间件/RabbitMQ消息中间件/1-RabbitMQ-setup'
                    }]
                }]
            },{ 
                text: '🏀', 
                items:[{
                    text: '球性计划-day1',
                    link: '/bball/1-day1'
                }]
            },{ 
                text: '关于',
                link: '/关于'
            }
        ],

        // 侧边栏
        sidebar: {
            '/Spring/SpringBoot/SpringBoot2.0集成Activiti6':[{
                title: "SpringBoot2.0集成Activiti6",
                collapsable: true,
                children:[
                    ['/Spring/SpringBoot/SpringBoot2.0集成Activiti6/1-springboot-activit-star', '1，开始配置'],
                    ['/Spring/SpringBoot/SpringBoot2.0集成Activiti6/2-activiti-context', '2，Activiti内容'],
                    ['/Spring/SpringBoot/SpringBoot2.0集成Activiti6/3-springboot-activiti-create', '3，创建流程文件(BPMN)'],
                    ['/Spring/SpringBoot/SpringBoot2.0集成Activiti6/4-springboot-activiti-ui', '4，整合官方在线设计器']
                ]
            }],
            '/中间件/RabbitMQ消息中间件':[{
                title: "RabbitMQ消息中间件",
                collapsable: true,
                children:[
                    ['/中间件/RabbitMQ消息中间件/1-RabbitMQ-setup', '1，RabbitMQ安装'],
                    ['/中间件/RabbitMQ消息中间件/2-RabbitMQ-context', '2，RabbitMQ介绍'],
                    ['/中间件/RabbitMQ消息中间件/3-RabbitMQ-SpringBoot', '3，SpringBoot整合MQ']
                ]
            }],
            '/bball':[{
                title: "THIS IS WHY WE PLAY",
                collapsable: true,
                children:[
                    ['/bball/1-day1', '球性计划-day1']
                ]
            }],
            '/关于':[{
                title: "我写我自己",
                collapsable: true,
                children:[
                    ['/关于', '关于']
                ]
            }]
        }
    }
}

























// ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ
// ᴡᴀɴɢᴜ









// sidebar: {
//     '/' : [
//         "/", //指的是根目录的md文件 也就是 README.md 里面的内容
//         "apiword",
//         "api",
//         "error" 
//     ]
// },
// sidebarDepth : 2


// sidebar: [
//     ['/home/instructions', '简介'],
//     {
//         title: "系统功能",
//         collapsable: false,
//         children:[
//             ['/home/add', '文档添加'],
//             ['/home/list', '文档列表'],
//             ['/home/edit', '文件编辑'],
            
//         ]
//     },
//     ['/tool/igit', 'igit公共账号'],
//     {
//         title: "文档工具",
//         collapsable: false,
//         children:[
//             ['/tool/gitbook', 'gitbook简介'],
//             ['/tool/vuepress', 'vuepress简介']
//         ]
//     }
// ]
