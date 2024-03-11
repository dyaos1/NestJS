# NestJS

# history

## feat: init board crud
```
npm install --save @nestjs/swagger
```

```typescript
const config = new DocumentBuilder()
    .setTitle('Simple Board')
    .setDescription('The Simple Board API description')
    .setVersion('1.0')
    .addTag('Board') // board controller에  @ApiTags('Board') 어노테이션 추가
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
```

## feat: enhance
### add dto

### validation
```
npm install class-validator class-transformer
```

> - ParseIntPipe: path param을 number로 변환
> - new ValidationPipe(): Dto에 붙은 validator를 동작되도록 만듬

### custom decorator
```typescript
// 예시
export const Ip = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip;
  },
);
```

### exception filter

### logger module

### configure module
```
npm install @nestjs/config
```

## feat: database
### typeORM
```
npm install @nestjs/typeorm typeorm pg
```

### relation
```
class User {
  ...
  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}
```
```
class Board {
  ...
  @ManyToOne(() => User)
  user: User;
}
```

### migration setting
```
npm i ts-node tsconfig-paths dotenv
```
```
  // pacage.json
{
  "scripts": {
    ...
    "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource ./src/database/data-source.ts",
    "migration:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ./src/database/migrations/Migration", //빈 마이그레이션 생성
    "migration:generate": "npm run typeorm migration:generate ./src/database/migrations/Migration", // 변경사항에 대해서 생성(그런데 가끔씩 드랍을 하므로 비추)
    "migration:run": "npm run typeorm  migration:run",
    "migration:revert": "npm run typeorm migration:revert"
  }
}
```
> node -r flag = --require

### seed
```
npm i typerom-extension

// package.json
{
  "scripts": {
    ...
    "seed": "ts-node -r tsconfig-paths/register ./node_modules/typeorm-extension/bin/cli.cjs seed:run"
  }
}
```

> https://www.npmjs.com/package/typeorm-extension

### CRUD repository
> repository.findOne과 findOnBy의 차이: OnBy는 where절이 포함
```
this.boardRepository.findOneBy({
      id,
    });
===
this.boardRepository.findOne({
      where: {
        id,
      }
    });    
```

> app module의 TyperomModule에 entities: ['src/**/*.entity.{ts,js}'], 로 하면 안되고 entities: [Board, User]로 하면 되는 이슈가 있음.
> 
> https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module
>
> entities: [__dirname + '/**/*.entity{.ts,.js}'], 이렇게 하는게 답인듯