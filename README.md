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

### jwt
```
npm i jsonwebtoken
// npm i -D types@jsontwebtoken
```

``` typescript
const accessToken = jwt.sign({payload}, privateKey, options)
```
> jsonwebtoken라이브러리는 default export가 없으므로 import * as jwt from 'jsonwebtoken'; 형태로 하여야 함
> https://github.com/auth0/node-jsonwebtoken

### passport
```
npm i @nestjs/passport passport passport-local
npm i -D @types/passport-local
```

```
nest g mo auth
nest g s auth
```
auth 모듈에 TypeOrmModule.forFeature([User]) 및 UserModule imports추가, AuthService exports 추가
user 모듈에 UserService exports 추가

strategy 추가 (PassportStrategy 상속)
auth 모듈 provider에 strategy 추가, imports 에 PassportStrategy 추가

authguard 추가

```
npm i @nestjs/jwt passport-jwt
npm i -D @types/passport-jwt
```
auth 모듈에 JwtModule.register({option}) 추가 ()
// https://docs.nestjs.com/security/authentication#implementing-the-authentication-guard  참조

auth service에 jwtService 의존성 주입 및, jwtService.sign으로 토큰 생성

### 중간점검  name: feat/passport intermediate inspection
> 현재까지의 로직이 너무 복잡하니 중간 점검을 한다. app.controller에 임시로 로그인 기능을 추가

1. app controller에서 @UseGuard에 걸림 -> LocalAuthGuard가 인자로 들어있음 -> LocalAuthGuard는 AuthGuard('local')을 상속중
2. AuthGuard('local')을 통해 (과정은 모르겠지만) LocalStrategy로 연결됨.
3. LocalStrategy에 들어있는 validate가 자동으로 실행되고, validate method는 authService의 validateUser 결과에 따라 user 반환.
4. 이 반환된 user값은 request.user에 들어감.
5. controller는 return 문에 request.user를 받아 authService.login메서드를 호출함
6. authService는 JwtService를 주입받고 있는데, authModule에서 JwtModule을 설정을 해놓았음. 이를 통해 최종적으로 jwt를 반환.


> 의문사항 정리.
> 1. AuthGuard('local')이 LocalStrategy로 어떻게 연결 되는지, 
> 2. validate는 어떤 과정으로 실행되고,
> 3. 반환한 값이 왜때문에 request.user로 들어가게 되는지
