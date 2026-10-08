export async function onRequestPost(context) {
    try {
        const data = await context.request.json();

        const { latitude, longitude } = data;

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {
            return Response.json(
                {
                    success: false,
                    message: "无效的定位数据"
                },
                { status: 400 }
            );
        }

        console.log("收到定位：", latitude, longitude);

        return Response.json({
            success: true,
            message: "定位接收成功",
            latitude,
            longitude
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            {
                success: false,
                message: "服务器错误"
            },
            { status: 500 }
        );
    }
}
