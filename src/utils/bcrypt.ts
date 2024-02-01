import { genSaltSync, hashSync, compareSync } from 'bcrypt';

// 生成盐
const salt = genSaltSync(10);

// 加密
export const encodePassword = (password: string) => {
  return hashSync(password, salt);
};

// 判断密码是否一致
export const comparePassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};
