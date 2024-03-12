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

## Authenticate

### query builder 를 이용해 virtual column 불러오기
```typescript
// call query builder instance 
  const qb = this.userRepository.createQueryBuilder();

// pattern example
  qb.addSelect((subQuery) => {
    return subQuery
      .select('{target}').from({entity}, '{alias}').where('{조건}')
  }, '{추가할 virtual column의 alias}')

// example
  qb.addSelect((subQuery) => {
    return subQuery
      .select('count(id)')
      .from(Board, 'Board')
      .where('Board.userId = User.id');
  }, 'User_boardCount');
  return qb.getMany();
```
> 1. virtual column은 entity에도 추가 되어 있어야 한다. @Column({ select: false, nullable: true, insert: false, update: false }) 어노테이션을 붙이면 생성, 업뎃, 조회 모두 되지 않으므로 virtual column이 된다.
> 2. virtual column의 alias는 그냥 컬럼명이 아닌 Table명_컬럼명 형태여야 한다.


### dto 생성
``` typescript
// 기타 유용한 validator
@IsIn(['femail', 'mail']) // : 특정값만 받을때
@IsEmail() // : email 형식
@IsPhoneNumber()
```

> https://github.com/typestack/class-validator 에 방문해서 custom validation classes/ custom validation decorators 확인


### encrypt pw
```
npm i bcrypt 
// npm i -D @types/bcrypt
```

> 주의사항: bcrypt에서 생성에 사용되는 hash()와 password 비교에 사용될 compare()는 모두 Promise를 반환함. 특히 compare()에 await 를 붙이지 않으면 모두 true로 착각할 수 있으므로 반드시 await 를 붙일것.
