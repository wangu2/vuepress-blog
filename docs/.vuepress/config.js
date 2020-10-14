


module.exports = {

    // 基础配置
    title: 'YOU CAN DO IT @ WANGU',
    head: [
        ['link', { rel: 'icon', href: `/favicon.ico` }]
    ],
    dest: './docs/.vuepress/dist',

    // plugins
    plugins:[
        ['@vuepress/medium-zoom', true],
        ['@vuepress/back-to-top', true],
        ['@vuepress/active-header-link', true],
        ['@vssue/vuepress-plugin-vssue', {
            platform: 'github',
            owner: 'wangu2',
            repo: 'vuepress-blog',
            clientId: 'bdd03846aeb849baa443',
            clientSecret: 'a8594968bd4186ceac5810e4f8331e5986410ed0',
            locale:'zh'
        }]
    ],

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
        nav : [
            { 
                text: '基本的',
                items:[
                    { text: 'Java 基础', link: '/1-base/java/java-oop' }
                ]
            },{ 
                text: 'Java Spring', 
                items:[{ 
                    text: '编辑器', 

                    items:[
                        { text: '//TODO IntelliJ IDEA', link: '/#2' }
                    ]
                },{
                    text: 'Spring Boot', 

                    items:[
                        { text: 'Spring Boot - 多模块项目创建', link: '/2-java-spring/Spring/SpringBoot/IDEA创建SpringBoot/1-idea-create-springboot' },
                        { text: '//TODO Spring Boot - Helloword', link: '/#3' },
                        { text: '//TODO Spring Boot - 多配置文件', link: '/#4' },
                        { text: '//TODO Spring Boot - LogBack日志配置', link: '/#5' },
                        { text: '//TODO Spring Boot - Swagger UI', link: '/#6' }
                    ]
                },{
                    text: 'Spring Security', 
                    items:[
                        { text: '//TODO 初始化', link: '/#7' },
                    ]
                }]
            },{ 
                text: '集成中间件', 
                items:[
                    { text: 'RabbitMQ 消息队列', link: '/3-java-extends/中间件/RabbitMQ消息中间件/1-RabbitMQ-setup' },
                    { text: 'Activiti6 工作流引擎', link: '/3-java-extends/中间件/SpringBoot2.0集成Activiti6/1-springboot-activit-star' },
                    { text: '//TODO Shardingsphere 分库分表', link: '/#8' },
                    { text: '//TODO Mybaits-Plus ORM 数据持久', link: '/#9' },
                    { text: '//TODO Druid 连接池', link: '/#10' }
                ]
            },{ 
                text: '翻过这座山',
                items:[
                    { text: '1.1.持久层框架设计实现及MyBatis源码分析', link: '/5-up/第一阶段/1-Mybaits源码解析' },
                    { text: '1.2.IoC容器设计实现及Spring源码分析', link: '/5-up/第一阶段/2-IoC容器设计及Spring源码' }
                ]
            },{ 
                text: '在读书单',
                link: '/#'
            },{ 
                text: '🏀', 
                items:[{
                    text: '球性训练计划',
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
                    ['1-day1', '球性计划-day1'],
                    ['1-day2', '球性计划-day2']
                ]
            }],
            '/1-base/java/':[{
                title: 'Java 基础',
                collapsable: false,
                sidebarDepth:0,
                children:[
                    'java-oop',
                    'java-abc-interface'
                ]
            },{
                title: '设计模式',
                collapsable: false,
                sidebarDepth:0,
                children:[]
            }],
            '/2-java-spring/Spring/SpringBoot/IDEA创建SpringBoot/':[
                '1-idea-create-springboot'
            ],
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
            ],
            '/5-up/第一阶段/':[
                '1-Mybaits源码解析',
                '2-IoC容器设计及Spring源码'
            ]
        }
    }
}

























// ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ
// ᴡᴀɴɢᴜ







// sidebar: {
//     '' : [
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
