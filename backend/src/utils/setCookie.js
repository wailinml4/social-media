const setCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        secure: (process.env.NODE_ENV || "development") !== "development",
        maxAge: 3600000,
    })
}

export default setCookie
