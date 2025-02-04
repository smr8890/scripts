import fs from 'fs';
import path from 'path';

//点赞次数
const likeNum = 10;

const autoLikeDir = path.join(process.cwd(), 'data/autoLike/autoLike.json');

export class Like extends plugin {
    constructor() {
        super(
            {
                name: '自动点赞',
                dsc: '每天自动点赞',
                event: 'message',
                priority: 5000,
                rule: [
                    {
                        reg: '^#开启自动点赞$',
                        fnc: 'openAutoLike',
                    },
                    {
                        reg: '^#关闭自动点赞$',
                        fnc: 'closeAutoLike',
                    },
                    {
                        reg: '^#开启点赞通知$',
                        fnc: 'openPush',
                    },
                    {
                        reg: '^#关闭点赞通知$',
                        fnc: 'closePush',
                    }
                ]
            }
        );

        this.task = {
            cron: '0 30 7 * * ?',
            name: '自动点赞',
            fnc: () => this.autoLike()
        }
    }

    async openAutoLike(e) {
        const userId = e.user_id;
        // 检查配置文件是否存在
        if (!fs.existsSync(autoLikeDir)) {
            fs.mkdirSync(path.dirname(autoLikeDir), { recursive: true });
            fs.writeFileSync(autoLikeDir, JSON.stringify({}));
        }

        // 读取配置文件
        let autoLikeConfig = JSON.parse(fs.readFileSync(autoLikeDir, 'utf8'));

        // 更新配置文件
        autoLikeConfig[userId] = { autoLike: true, push: true };

        // 写入配置文件
        fs.writeFileSync(autoLikeDir, JSON.stringify(autoLikeConfig, null, 2));

        return this.reply('已开启自动点赞', true);
    }

    async closeAutoLike(e) {
        const userId = e.user_id;
        // 检查配置文件是否存在
        if (!fs.existsSync(autoLikeDir)) {
            fs.mkdirSync(path.dirname(autoLikeDir), { recursive: true });
            fs.writeFileSync(autoLikeDir, JSON.stringify({}));
        }

        // 读取配置文件
        let autoLikeConfig = JSON.parse(fs.readFileSync(autoLikeDir, 'utf8'));

        // 更新配置文件
        autoLikeConfig[userId] = { autoLike: false, push: false };

        // 写入配置文件
        fs.writeFileSync(autoLikeDir, JSON.stringify(autoLikeConfig, null, 2));

        return this.reply('已关闭自动点赞', true);
    }

    async openPush(e) {
        const userId = e.user_id;
        // 检查配置文件是否存在
        if (!fs.existsSync(autoLikeDir)) {
            fs.mkdirSync(path.dirname(autoLikeDir), { recursive: true });
            fs.writeFileSync(autoLikeDir, JSON.stringify({}));
        }

        // 读取配置文件
        let autoLikeConfig = JSON.parse(fs.readFileSync(autoLikeDir, 'utf8'));

        // 更新配置文件
        autoLikeConfig[userId] = { autoLike: true, push: true };

        // 写入配置文件
        fs.writeFileSync(autoLikeDir, JSON.stringify(autoLikeConfig, null, 2));

        return this.reply('已开启点赞通知', true);
    }

    async closePush(e) {
        const userId = e.user_id;
        // 检查配置文件是否存在
        if (!fs.existsSync(autoLikeDir)) {
            fs.mkdirSync(path.dirname(autoLikeDir), { recursive: true });
            fs.writeFileSync(autoLikeDir, JSON.stringify({}));
        }

        // 读取配置文件
        let autoLikeConfig = JSON.parse(fs.readFileSync(autoLikeDir, 'utf8'));

        // 更新配置文件
        autoLikeConfig[userId] = { autoLike: true, push: false };

        // 写入配置文件
        fs.writeFileSync(autoLikeDir, JSON.stringify(autoLikeConfig, null, 2));

        return this.reply('已关闭点赞通知', true);
    }

    async autoLike() {
        // 检查配置文件是否存在
        if (!fs.existsSync(autoLikeDir)) {
            fs.mkdirSync(path.dirname(autoLikeDir), { recursive: true });
            fs.writeFileSync(autoLikeDir, JSON.stringify({}));
        }

        // 读取配置文件
        let autoLikeConfig = JSON.parse(fs.readFileSync(autoLikeDir, 'utf8'));

        // 遍历配置文件
        for (let userId in autoLikeConfig) {
            // 判断是否开启自动点赞
            if (autoLikeConfig[userId].autoLike) {
                Bot.pickFriend(userId).thumbUp(likeNum);
                logger.info(`[autoLike] ${userId} 已自动点赞${likeNum}次`);
                // 判断是否开启点赞通知
                if (autoLikeConfig[userId].push) {
                    Bot.pickUser(userId).sendMsg(`已自动点赞${likeNum}次`);
                }
            }
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}