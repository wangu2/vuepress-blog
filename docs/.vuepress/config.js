


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
                items:[
                    { text: '//TODO Java 面向对象基础', link: '/#' }
                ]
            },{ 
                text: 'Java Spring', 
                items:[{ 
                    text: '编辑器', items:[
                        { text: '//TODO IntelliJ IDEA', link: '/#' }
                    ]
                },{
                    text: 'Spring Boot', items:[
                        { text: '//TODO Spring Boot - 多模块项目创建', link: '/#' },
                        { text: '//TODO Spring Boot - Helloword', link: '/#' },
                        { text: '//TODO Spring Boot - 多配置文件', link: '/#' },
                        { text: '//TODO Spring Boot - LogBack日志配置', link: '/#' },
                        { text: '//TODO Spring Boot - Swagger UI', link: '/#' }
                    ]
                },{
                    text: 'Spring Security', items:[
                        { text: '//TODO 初始化', link: '/#' },
                    ]
                }]
            },{ 
                text: 'Java 集成、中间件', 
                items:[
                    { text: 'RabbitMQ 消息队列', link: '/3-java-extends/中间件/RabbitMQ消息中间件/1-RabbitMQ-setup' },
                    { text: 'Activiti6 工作流引擎', link: '/3-java-extends/中间件/SpringBoot2.0集成Activiti6/1-springboot-activit-star' },
                    { text: '//TODO Shardingsphere 分库分表', link: '/#' },
                    { text: '//TODO Mybaits-Plus ORM 数据持久', link: '/#' },
                    { text: '//TODO Druid 连接池', link: '/#' }
                ]
            },{ 
                text: '翻过这座山', 
                items:[{ 
                    text: '第一阶段', 
                    items:[{
                        text: '//TODO 持久层框架设计实现及MyBatis源码分析',
                        link: '/#'
                    }]
                }]
            },{ 
                text: '🏀', 
                items:[{
                    text: '球性计划-day1',
                    link: '/0-life/basketball/1-day1'
                }]
            },{ 

                text: '关于',
                link: '/关于'
            }
        ],

        // 侧边栏
        sidebar: {
            // 关于
            '/关于':[{
                title: "我写我自己",
                collapsable: true,
                children:[
                    ['/关于', '关于']
                ]
            }],
            // 生活积累
            '/0-life/basketball/':[{
                title: "THIS IS WHY WE PLAY",
                collapsable: true,
                children:[
                    ['1-day1', '球性计划-day1']
                ]
            }],
            '/3-java-extends/中间件/SpringBoot2.0集成Activiti6/':[
                '1-springboot-activit-star',
                '2-activiti-context',
                '3-springboot-activiti-create',
                '4-springboot-activiti-ui'
            ],
            '/3-java-extends/中间件/RabbitMQ消息中间件/':[
                '1-RabbitMQ-setup',
                '2-RabbitMQ-context',
                '3-RabbitMQ-SpringBoot'
            ]
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
