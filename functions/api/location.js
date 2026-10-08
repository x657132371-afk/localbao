export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    const {
      latitude,
      longitude,
      accuracy,
      recordedAt
    } = data;

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

    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return Response.json(
        {
          success: false,
          message: "经纬度超出有效范围"
        },
        { status: 400 }
      );
    }

    await context.env.DB
      .prepare(`
        INSERT INTO locations
        (latitude, longitude, accuracy, recorded_at)
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        latitude,
        longitude,
        typeof accuracy === "number" ? accuracy : null,
        recordedAt || new Date().toISOString()
      )
      .run();

    console.log(
      "定位已保存:",
      latitude,
      longitude,
      accuracy
    );

    return Response.json({
      success: true,
      message: "定位保存成功"
    });

  } catch (error) {
    console.error("保存定位失败:", error);

    return Response.json(
      {
        success: false,
        message: "服务器保存失败"
      },
      { status: 500 }
    );
  }
}
