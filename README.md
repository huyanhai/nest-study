# 执行npx prisma db push的时候需要进入到prisma同级目录

- 一对一

```ts
model User {
  id    Int    @id @default(autoincrement())
  role  Role   @default(USER)
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int // relation scalar field (used in the `@relation` attribute above)
}
```

- 一对多

```ts
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```
@relation 表示字段直接关系, 第一个参数表示关系名称，可以不传，第二字段是 fields 表示关联外键，reference 表示当前字段的关系。