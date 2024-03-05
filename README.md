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