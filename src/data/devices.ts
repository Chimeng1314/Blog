import type {DeviceCategory} from "@/types/devices";

/**
 * 我的设备数据。分类名称会直接作为页面筛选项显示。
 * 图片统一放在 public/assets/images/devices，并使用 /assets/ 开头的本地路径。
 */
export const devicesData: DeviceCategory[] = [
    {
        name: "办公设备",
        icon: "material-symbols:laptop-mac",
        devices: [
            {
                slug: "desktop-main",
                name: "我的台式机",
                icon: "material-symbols:desktop-windows-rounded",
                image: "/assets/images/devices/desktop/main/computer.jpg",
                specs: "i5-12600KF / RX 6750 GRE / 32GB DDR4",
                description: "以 i5-12600KF 与 RX 6750 GRE 为核心的游戏与日常使用主机。",
                url: "",
                linkable: false,
                status: "在用",
                specGroups: [
                    {
                        title: "核心硬件",
                        items: [
                            {
                                label: "CPU",
                                value: "Intel Core i5-12600KF（盒装）",
                                image: "/assets/images/devices/desktop/main/intel-core-i5-12600kf.png",
                            },
                            {
                                label: "主板",
                                value: "微星 B760M BOMBER WIFI DDR4",
                                image: "/assets/images/devices/desktop/main/msi-b760m-bomber-wifi-ddr4.png",
                            },
                            {
                                label: "内存",
                                value: "金百达（KINGBANK）银爵 DDR4-3600 32GB（16GB × 2）",
                                image: "/assets/images/devices/desktop/main/kingbank-yinjue-ddr4-3600-32gb.png",
                            },
                            {
                                label: "显卡",
                                value: "华硕 DUAL RX 6750 GRE 12GB V2 雪豹",
                                image: "/assets/images/devices/desktop/main/asus-dual-rx-6750-gre-12gb-v2.png",
                            },
                        ],
                    },
                    {
                        title: "存储",
                        items: [
                            {
                                label: "系统盘",
                                value: "铠侠（KIOXIA）EXCERIA PLUS G3（极至光速） 1TB",
                                image: "/assets/images/devices/desktop/main/kioxia-sd10-1tb.png",
                            },
                            {
                                label: "固态硬盘",
                                value: "致态（ZHITAI）TiPlus7100  2TB",
                                image: "/assets/images/devices/desktop/main/zhitai-tiplus7100.png",
                            },
                            {
                                label: "机械硬盘（2.5英寸）",
                                value: "西部数据（WD）黑盘（WD Black） 500GB",
                                image: "/assets/images/devices/desktop/main/wd5000lplx-66zntt1-500gb.png",
                            },
                        ],
                    },
                    {
                        title: "散热与供电",
                        items: [
                            {
                                label: "散热器",
                                value: "酷里奥 倚天 FF135 镀镍双塔六热管",
                                image: "/assets/images/devices/desktop/main/coolleo-ff135.png",
                            },
                            {
                                label: "电源",
                                value: "爱国者 EU650W ATX 3.0 铜牌全模组（五年质保）",
                                image: "/assets/images/devices/desktop/main/aigo-eu650w-atx3.png",
                            },
                        ],
                    },
                    {
                        title: "机箱",
                        items: [
                            {
                                label: "型号",
                                value: "机械大师 IF17 逻辑库（带提手）",
                                image: "/assets/images/devices/desktop/main/mechanical-master-if17.png",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "macbook-pro-m3-pro-2023",
                name: "我的 MacBook Pro（2023）",
                image: "/assets/images/devices/office/macbook-pro-16-m3-pro-silver.jpg",
                icon: "material-symbols:laptop-mac",
                specs: "Apple M3 Pro / 36GB 统一内存 / 4TB SSD",
                description: "2023 款 MacBook Pro，搭载 Apple M3 Pro 芯片与 4TB 内置 SSD。",
                url: "https://www.apple.com.cn/macbook-pro/",
                status: "在用",
                specGroups: [
                    {
                        title: "硬件概览",
                        items: [
                            {
                                label: "型号名称",
                                value: "MacBook Pro（2023）",
                            },


                            {
                                label: "尺寸",
                                value: "16 英寸",
                            },
                            {
                                label: "颜色",
                                value: "银色",
                            },
                            {
                                label: "芯片",
                                value: "Apple M3 Pro",
                            },
                            {
                                label: "CPU 核心",
                                value: "12 核（6 性能核心 + 6 能效核心）",
                            },
                            {
                                label: "统一内存",
                                value: "36GB",
                            },
                        ],
                    },
                    {
                        title: "存储",
                        items: [
                            {
                                label: "容量",
                                value: "4TB",
                            },

                            {
                                label: "文件系统",
                                value: "APFS（Data 宗卷）",
                            },
                            {
                                label: "内置 SSD",
                                value: "APPLE SSD AP4096Z",
                            },
                            {
                                label: "接口协议",
                                value: "Apple Fabric",
                            },

                        ],
                    },

                ],
                accessories: [],
            },
        ],
    },
    {
        name: "外设",
        icon: "material-symbols:keyboard-rounded",
        devices: [
            {
                slug: "vgn-v98pro-v2",
                name: "VGN V98Pro V2 键盘(黑加仑色)",
                image: "/assets/images/devices/peripherals/vgn-v98pro-v2-heijialun.jpg",
                specs: "BOX 冰淇淋轴 Pro 机械键盘",
                description: "VGN V98Pro V2 BOX 冰淇淋轴 Pro 机械键盘。",
                url: "https://www.vgnlab.com.cn/web/sku-713",
                associatedDevice: {
                    slug: "desktop-main",
                    name: "我的台式机",
                },
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "V98Pro V2",
                            },
                            {
                                label: "轴体",
                                value: "BOX 冰淇淋轴 Pro",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "vgn-v98pro-v2-kailh-arctic-fox",
                name: "VGN V98Pro V2 键盘(海盐色)",
                image: "/assets/images/devices/peripherals/vgn-v98pro-v2.jpg",
                icon: "material-symbols:keyboard-rounded",
                specs: "凯华极地狐轴机械键盘",
                description: "搭载凯华极地狐轴的 VGN V98Pro V2 机械键盘。",
                url: "",
                linkable: false,
                status: "在用",
                associatedDevice: {
                    slug: "macbook-pro-m3-pro-2023",
                    name: "我的 MacBook Pro（2023）",
                },
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "V98Pro V2",
                            },
                            {
                                label: "轴体",
                                value: "凯华极地狐轴",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "logitech-g102-prodigy",
                name: "罗技 G G102 游戏鼠标",
                image: "/assets/images/devices/peripherals/logitech-g102-prodigy.png",
                specs: "有线电竞游戏鼠标",
                description: "罗技 G 系列 G102 Prodigy 游戏鼠标。",
                url: "https://www.logitech.com/zh-cn/shop/p/g102-prodigy-gaming-mouse.910-004852?sp=2&searchclick=Logitech%20G%20G102",
                associatedDevice: {
                    slug: "desktop-main",
                    name: "我的台式机",
                },
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "G102 Prodigy",
                            },
                            {
                                label: "设备类型",
                                value: "有线电竞游戏鼠标",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "hyperx-cloud-ii",
                name: "极度未知 HyperX 飓风 2 电竞耳机",
                image: "/assets/images/devices/peripherals/hyperx-cloud-ii.jpg",
                specs: "头戴式电竞游戏耳机",
                description: "HyperX Cloud II（飓风 2）头戴式电竞游戏耳机。",
                url: "https://hyperx.com/products/hyperx-cloud-ii",
                associatedDevice: {
                    slug: "desktop-main",
                    name: "我的台式机",
                },
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "HyperX Cloud II（飓风 2）",
                            },
                            {
                                label: "设备类型",
                                value: "头戴式电竞游戏耳机",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "hso-g251ph2",
                name: "HSO G251PH2 电竞显示器",
                icon: "material-symbols:monitor-rounded",
                image: "/assets/images/devices/peripherals/hso-g521.png",
                specs: "24.5 英寸 IPS / 240Hz",
                description: "支持 Adaptive-Sync、升降与旋转支架的 24.5 英寸高刷新率电竞显示器。",
                url: "",
                linkable: false,
                associatedDevice: {
                    slug: "desktop-main",
                    name: "我的台式机",
                },
                status: "在用",
                specGroups: [
                    {
                        title: "屏幕与支架",
                        items: [
                            {
                                label: "产品型号",
                                value: "G251PH2",
                            },
                            {
                                label: "面板",
                                value: "24.5 英寸 IPS",
                            },
                            {
                                label: "刷新率",
                                value: "240Hz",
                            },
                            {
                                label: "同步技术",
                                value: "Adaptive-Sync",
                            },
                            {
                                label: "支架",
                                value: "全金属升降旋转人体工程学支架",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "sculptor-portable-monitor-15-6",
                name: "雕塑家 15.6 英寸便携显示器",
                image: "/assets/images/devices/peripherals/sculptor-portable-monitor-15-6.avif",
                specs: "15.6 英寸便携扩展屏",
                description: "可用于电脑、手机与笔记本的 15.6 英寸便携显示器。",
                url: "",
                linkable: false,
                status: "在用",
                associatedDevice: {
                    slug: "macbook-pro-m3-pro-2023",
                    name: "我的 MacBook Pro（2023）",
                },
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "品牌",
                                value: "雕塑家",
                            },
                            {
                                label: "屏幕尺寸",
                                value: "15.6 英寸",
                            },
                            {
                                label: "设备类型",
                                value: "便携显示器 / 扩展屏",
                            },
                        ],
                    },
                ],
                accessories: [],
            },

        ],
    },
    {
        name: "华为系列",
        icon: "material-symbols:smartphone",
        devices: [
            {
                slug: "huawei-mate-60-pro",
                name: "HUAWEI Mate 60 Pro",
                image: "/assets/images/devices/mobile/huawei/mate-60-pro-green.png",
                specs: "12GB + 1TB",
                description: "HUAWEI Mate 60 Pro",
                url: "https://consumer.huawei.com/cn/support/phones/mate60-pro/",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "HUAWEI Mate 60 Pro",
                            },
                            {
                                label: "内存",
                                value: "12GB",
                            },
                            {
                                label: "存储",
                                value: "1TB",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "huawei-matepad-11-5-s-2025",
                name: "HUAWEI MatePad 11.5\" S 灵动款（2025）",
                image: "/assets/images/devices/mobile/huawei/matepad-11-5-s-2025-green.png",
                specs: "8GB + 256GB / Wi-Fi / 湖光青",
                description: "2.8K 高刷全面屏学习平板电脑。",
                url: "https://consumer.huawei.com/cn/support/tablets/matepad-11-5-s-2025/",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "HUAWEI MatePad 11.5\" S 灵动款（2025）",
                            },
                            {
                                label: "内存",
                                value: "8GB",
                            },
                            {
                                label: "存储",
                                value: "256GB",
                            },
                            {
                                label: "网络版本",
                                value: "Wi-Fi",
                            },
                            {
                                label: "颜色",
                                value: "湖光青",
                            },
                            {
                                label: "屏幕",
                                value: "11.5 英寸 2.8K 高刷全面屏",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "huawei-freebuds-pro-4-snake-edition",
                name: "HUAWEI FreeBuds Pro 4 悦彰耳机",
                image: "/assets/images/devices/mobile/huawei/freebuds-pro-4-spruce-green.png",
                specs: "蛇年典藏版 / 云杉绿",
                description: "蛇年典藏版云杉绿无线蓝牙耳机，支持静谧通话。",
                url: "https://consumer.huawei.com/cn/support/headphones/freebuds-pro-4/",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "HUAWEI FreeBuds Pro 4 悦彰耳机",
                            },
                            {
                                label: "版本",
                                value: "蛇年典藏版",
                            },
                            {
                                label: "颜色",
                                value: "云杉绿",
                            },
                            {
                                label: "连接方式",
                                value: "无线蓝牙",
                            },
                            {
                                label: "通话",
                                value: "静谧通话",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
        ],
    },
    {
        name: "大疆系列",
        icon: "material-symbols:videocam-rounded",
        devices: [
            {
                slug: "dji-osmo-action-4",
                name: "DJI Osmo Action 4",
                image: "/assets/images/devices/imaging/dji/dji-osmo-action-4.png",
                specs: "4K 运动相机",
                description: "DJI Osmo Action 4 运动相机。",
                url: "https://www.dji.com/cn/osmo-action-4",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "DJI Osmo Action 4",
                            },
                            {
                                label: "设备类型",
                                value: "4K 运动相机",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
        ],
    },
    {
        name: "网络与存储",
        icon: "material-symbols:router",
        devices: [
            {
                slug: "home-server",
                name: "绿联DXP4800 Plus",
                image: "/assets/images/devices/network-storage/ugreen-dxp4800-plus.png",
                specs: "绿联NAS私有云存储-DXP4800 Plus",
                description:
                    "DXP4800 Plus是四盘位NAS私有云，支持双M.2 SSD，它采用的是英特尔奔腾金牌8505 处理器，支持DDR5-4800MHz 内存，最高可扩展至64GB；另外，还板载了128GB SSD 储存，尾部除了2.5G外，还有万兆网口，以及其他丰富的扩展接口",
                url: "https://www.ugnas.com/products-parameter/id-39.html",
                status: "在用",
                specGroups: [
                    {
                        title: "核心配置",
                        items: [
                            {
                                label: "处理器型号",
                                value: "Intel® Pentium® Gold Processor 8505",
                                url: "",
                            },
                            {
                                label: "核心数量",
                                value: "5核6线程",
                                url: "",
                            },
                            {
                                label: "处理器架构",
                                value: "X86",
                                url: "",
                            },
                            {
                                label: "处理器频率",
                                value: "1.2GHz-4.4GHz",
                                url: "",
                            },
                            {
                                label: "工艺",
                                value: "Intel 7",
                                url: "",
                            },
                        ],
                    },
                    {
                        title: "显卡",
                        items: [
                            {
                                label: "型号",
                                value: "Intel® UHD Graphics for 12th Gen Intel® Processors",
                                url: "",
                            },
                        ],
                    },
                    {
                        title: "内存",
                        items: [
                            {
                                label: "内存大小",
                                value: "8GB",
                                url: "",
                            },
                            {
                                label: "类型",
                                value: "DDR5",
                                url: "",
                            },
                            {
                                label: "内存插槽总数",
                                value: "2",
                                url: "",
                            },
                            {
                                label: "容量上限",
                                value: "64GB",
                                url: "",
                            },
                            {
                                label: "最高支持频率",
                                value: "4800 MHz",
                                url: "",
                            },
                        ],
                    },
                    {
                        title: "闪存",
                        items: [
                            {
                                label: "闪存大小",
                                value: "128GB",
                                url: "",
                            },
                        ],
                    },
                    {
                        title: "SATA接口",
                        items: [
                            {
                                label: "插槽数量",
                                value: "4",
                                url: "",
                            },
                            {
                                label: "协议",
                                value: "SATA3.0",
                                url: "",
                            },
                            {
                                label: "硬盘规格",
                                value: "2.5英寸/3.5英寸",
                                url: "",
                            },
                            {
                                label: "SATA最大容量",
                                value: "30Tx4",
                                url: "",
                            },
                            {
                                label: "SATA盘1",
                                value: "希捷（Seagate）IronWolf（酷狼） ST4000VN006-3CW104 4TB",
                                url: "",
                            },
                            {
                                label: "SATA盘2",
                                value: "希捷（SEAGATE） ST500DM002 500GB",
                                url: "",
                            },
                            {
                                label: "SATA盘3",
                                value: "西部数据（WD） WUH721816ALE6L4 16TB",
                                url: "",
                            },
                            {
                                label: "SATA盘4",
                                value:
                                    "希捷（Seagate）Barracuda（酷鱼）ST500DM002-1BD142 500GB",
                                url: "",
                            },
                        ],
                    },
                    {
                        title: "网络",
                        items: [
                            {
                                label: "网口速率",
                                value: "10Gbps",
                                url: "",
                            },
                            {
                                label: "网络接口",
                                value: "2.5GbE*1 + 10GbE*1",
                                url: "",
                            },
                            {
                                label: "WIFI",
                                value: "Wifi免驱动超快双频USB无线网卡",
                                url: "",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
        ],
    },
    {
        name: "酷泰科系列",
        icon: "material-symbols:bolt-rounded",
        devices: [
            {
                slug: "cuktech-ad1204u",
                name: "CUKTECH 酷态科 10号氮化镓充电器 Ultra",
                image: "/assets/images/devices/power/cuktech/cuktech-10-ultra.webp",
                specs: "120W 屏显氮化镓充电器",
                description: "酷态科官网 10号氮化镓充电器 Ultra。",
                url: "https://cuktech.com.cn/products/ad1204u.html",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "AD1204U",
                            },
                            {
                                label: "额定总输出",
                                value: "120W MAX",
                            },
                            {
                                label: "屏幕",
                                value: "1.57 英寸万象屏（200 × 320 TFT）",
                            },
                            {
                                label: "智能互联",
                                value: "已接入米家 App，支持 OTA 升级",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "desktop-input",
                name: "CUKTECH酷态科10号电能基站-万象屏",
                image: "/assets/images/devices/power/cuktech/cuktech-10-main.jpg",
                specs: "会自我进化的桌面快充基站",
                description: "酷态科官网 10 号电能基站「万象屏套装」。",
                url: "https://cuktech.com.cn/products/ta1208.html",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品型号",
                                value: "TA1208 + AP01（万象屏套装）",
                            },
                            {
                                label: "产品形态",
                                value: "10号电能基站 + 2.8 英寸万象屏",
                            },
                            {
                                label: "USB 接口",
                                value: "3C1A",
                            },
                            {
                                label: "交流插座",
                                value: "支持 AC 插座，2500W MAX",
                            },
                            {
                                label: "快充协议",
                                value: "支持 PD / AVS 快充",
                            },
                            {
                                label: "桌面充电功率",
                                value: "120W / 60W",
                            },
                            {
                                label: "智能互联",
                                value: "已接入米家 App",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
        ],
    },
    {
        name: "米家系列",
        icon: "material-symbols:devices-other-sharp",
        devices: [
            {
                slug: "mijia-ac-companion-2",
                name: "米家空调伴侣2",
                image: "/assets/images/devices/smart-home/mijia/mijia-ac-companion-2.png",
                specs: "空调智能控制器",
                description: "通过米家 App 连接并控制家中空调。",
                url: "https://www.mi.com/shop/buy/detail?product_id=9726&cfrom=search",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品名称",
                                value: "米家空调伴侣2",
                            },
                            {
                                label: "设备类型",
                                value: "空调智能控制器",
                            },
                            {
                                label: "智能互联",
                                value: "米家 App",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "mijia-smart-plug-3",
                name: "米家智能插座3",
                image: "/assets/images/devices/smart-home/mijia/mijia-smart-plug-3.png",
                specs: "智能插座",
                description: "支持通过米家 App 远程控制的智能插座。",
                url: "https://www.mi.com/shop/buy/detail?product_id=16421&cfrom=search",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品名称",
                                value: "米家智能插座3",
                            },
                            {
                                label: "设备类型",
                                value: "智能插座",
                            },
                            {
                                label: "智能互联",
                                value: "米家 App",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "mijia-led-bulb-mesh",
                name: "米家LED灯泡 蓝牙MESH版",
                image: "/assets/images/devices/smart-home/mijia/mijia-led-bulb-mesh.png",
                specs: "蓝牙 Mesh 智能灯泡",
                description: "可接入米家 App 的蓝牙 Mesh 智能照明设备。",
                url: "https://www.mi.com/shop/buy/detail?product_id=11507&cfrom=search",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品名称",
                                value: "米家LED灯泡 蓝牙MESH版",
                            },
                            {
                                label: "连接方式",
                                value: "蓝牙 Mesh",
                            },
                            {
                                label: "智能互联",
                                value: "米家 App",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "mijia-temperature-humidity-monitor-2",
                name: "小米米家蓝牙温湿度计 2",
                image: "/assets/images/devices/smart-home/mijia/mijia-temperature-humidity-monitor-2.jpg",
                specs: "蓝牙温湿度传感器",
                description: "用于监测室内温度与湿度的米家蓝牙设备。",
                url: "https://www.mi.com/shop/buy/detail?product_id=11202&cfrom=search",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品名称",
                                value: "小米米家蓝牙温湿度计 2",
                            },
                            {
                                label: "设备类型",
                                value: "温湿度传感器",
                            },
                            {
                                label: "连接方式",
                                value: "蓝牙",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "xiaomi-router-be6500-pro",
                name: "Xiaomi路由器 BE6500 Pro 黑色",
                image: "/assets/images/devices/smart-home/mijia/xiaomi-router-be6500-pro.png",
                specs: "Wi-Fi 7 路由器",
                description: "黑色 Xiaomi 路由器 BE6500 Pro。",
                url: "https://www.mi.com/xiaomi-routers/6500pro?product_id=1230809604&cfrom=search",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品名称",
                                value: "Xiaomi路由器 BE6500 Pro",
                            },
                            {
                                label: "颜色",
                                value: "黑色",
                            },
                            {
                                label: "无线标准",
                                value: "Wi-Fi 7",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
            {
                slug: "redmi-xiaoai-touchscreen-speaker-8",
                name: "小爱触屏音箱8",
                image: "/assets/images/devices/smart-home/mijia/redmi-xiaoai-touchscreen-speaker-8.jpg",
                specs: "带屏智能音箱",
                description: "小爱同学语音助手与触控屏幕结合的智能音箱。",
                url: "https://www.mi.com/redmi-xai?product_id=1201300001&cfrom=search",
                status: "在用",
                specGroups: [
                    {
                        title: "基础信息",
                        items: [
                            {
                                label: "产品名称",
                                value: "小爱触屏音箱8",
                            },
                            {
                                label: "设备类型",
                                value: "带屏智能音箱",
                            },
                            {
                                label: "智能互联",
                                value: "米家 App / 小爱同学",
                            },
                        ],
                    },
                ],
                accessories: [],
            },
        ],
    },
];
