# Nestjs E-commerce Frame

## ⭐ TypeORM

메인에 올라간 코드와 달리 TypeORM으로 구현되어 있습니다.

엔티티 클래스를 정의하고 레포지토리 패턴을 사용해 작성되었습니다.

- [src/entities](https://github.com/rimo030/nestjs-e-commerce-frame/tree/refactor/typeorm/src/entities)
- [src/repositories](https://github.com/rimo030/nestjs-e-commerce-frame/tree/refactor/typeorm/src/repositories)

<br>

마이그레이션 이유와 과정은 아래 이슈에서 자세히 확인해 보실수 있습니다!

- [Prisma (Migrate from TypeORM) #95](https://github.com/rimo030/nestjs-e-commerce-frame/issues/95)

<br>

## 📍프로젝트 실행 방법

로컬에서 프로젝트를 실행하는 방법을 소개합니다.

### 1. 설치

```sh
$ git clone https://github.com/rimo030/nestjs-e-commerce-frame.git
$ cd nestjs-e-commerce-frame

$ npm install
```

<br>

### 2. env 작성

`.env.example`을 참고해 `.env`파일을 작성합니다.

<br>

### 3. DB 설정

mysql 컨테이너를 생성합니다.

```sh
$ docker-compose up -d
```

컨테이너에 접속해 데이터베이스를 생성합니다.

```sh
$ docker exec -it CommerceDB bash

$ mysql -u 계정이름 -p 비밀번호
$ create database commerce;
```

<br>

### 4. DB 스키마 생성

```sh
$ schema:sync:local
```

<br>

### 5. 서버 실행

```sh
$ npm run start

# dev
$ npm run start:dev
```

<br>

### Swagger 접속 주소

```sh
http://localhost:3000/api
```
