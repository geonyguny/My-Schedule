const jwt = require("jsonwebtoken");

const token = jwt.sign(
        { userIdx: 1 }, // payload 정의
        "a123" // 서버 비밀키
      );

console.log(token);

const verifiedToken = jwt.verify(token, "a12345");
console.log(verifiedToken);