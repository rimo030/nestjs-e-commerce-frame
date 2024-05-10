# Nestjs E-commerce Frame

## ⭐프로젝트 소개

NestJS로 커머스 백엔드 API 구현합니다.

회원가입, 상품 관리, 장바구니, 결제 등의 주요 API를 제공하여 쉽게 커머스 애플리케이션을 만들 수 있도록 합니다.

<br>

## ⚙️기술 스택

| 분류          | 기술 스택                                                                                                                                                                                                                                                                                                                                                                      |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language      | [![](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=TypeScript&logoColor=white)]()                                                                                                                                                                                                                                                                      |
| Backend       | [![](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white)]() [![](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white)]() [![](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=Prisma&logoColor=white)]() [![](https://img.shields.io/badge/TypeORM-FE5F50?style=flat-square)]() |
| DB            | [![](https://img.shields.io/badge/Mysql-4479A1?style=flat-square&logo=MySql&logoColor=white)]()                                                                                                                                                                                                                                                                                |
| Testing       | [![](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=Jest&logoColor=white)]()                                                                                                                                                                                                                                                                                  |
| DevOps        | [![](https://img.shields.io/badge/github-181717?style=flat-square&logo=github&logoColor=white)]() [![](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonAWS&logoColor=white)]() [![](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=Docker&logoColor=white)]()                                                                          |
| Documentation | [![](https://img.shields.io/badge/Swagger-83B81A?style=flat-square&logo=Swagger&logoColor=white)]()                                                                                                                                                                                                                                                                            |

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

`.env.example`을 참고해 `.env`파일을 작성 합니다.

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
# Prisma
$ npx prisma db push

# TypeORM
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

<br>

## 🔗ERD

![Untitled (2)](https://github.com/rimo030/nestjs-e-commerce-frame/assets/109577985/5ff87344-b957-4f28-bea3-6c96a2fa5d86)

<br>

## ✌️기술적 경험

[이슈](https://github.com/rimo030/nestjs-e-commerce-frame/issues)를 통해 여러 기술적인 내용을 논의하고 배웠습니다. <br>
배운 내용을 잘 기억하고 나누기 위해 [개인블로그](https://munak.tistory.com/)에 정리하고 있습니다!

### Git

Git 이용한 첫 프로젝트 입니다. 기초적인 clone, pull, push 부터 cherry-pick, rebase등 Git의 여러 기능을 학습했습니다. <br>
프로젝트에 Git-commit-convention과 Git-flow를 적용하였습니다.

**학습 기록**

- [github commit convension #7](https://github.com/rimo030/nestjs-e-commerce-frame/issues/7#issue-1973493348)

<br>

### Node.js / JS

Node.js 백엔드 개발 생태계와 학습했습니다. <br>
근간이 되는 자바스크립트을 더 잘 이해하고자 노력하였습니다. 블로그에 관련 도서나 자료를 읽고 정리하고 있습니다.

**학습 기록**

- ✏️[[JS]JavaScript와 Node.js](https://munak.tistory.com/147)
- ✏️[[Node.js] npm과 package.json](https://munak.tistory.com/144)
- ✏️[[JS] 함수형 프로그래밍(FP : Functional Programming)](https://munak.tistory.com/150)
- ✏️[[JS] 자바스크립트가 데이터를 할당하는 방법 (feat. 불변성, 가변성)](https://munak.tistory.com/181)
- ✏️[[JS] 자바스크립트의 변수 복사 (feat. 얕은복사, 깊은복사)](https://munak.tistory.com/183)
- ✏️[[JS] 프로토타입(Prototype) 이해하기](https://munak.tistory.com/188)

<br>

### NestJS

NestJS를 이용한 첫 프로젝트 입니다. DI와 레이어간 역할 분리의 개념에 대해 배울 수 있었습니다. <br>

**학습 기록**

- [NestJS 구조정리](https://github.com/rimo030/nestjs-e-commerce-frame/issues/6)
- ✏️[[NestJS] Swagger 적용하기 (feat. API 문서화)](https://munak.tistory.com/186)
- ✏️[[NestJS] Exception filters 추가하기 (feat.Custom Exception)](https://munak.tistory.com/189)
  <br>

### TS

NestJS를 보다 잘 다루기 위해 타입스크립트를 심도있게 공부하고자 했습니다. <br>
타입챌린지([rimo030/type-challenges](https://github.com/rimo030/type-challenges))에 도전해 100문제 이상 풀이했습니다.

**학습 기록**

- ✏️[[TS] TypeScript 시작하기](https://munak.tistory.com/148)
- ✏️[[TS] TypeScript의 기본 타입](https://munak.tistory.com/161)
- ✏️[[TS] TypeScript의 타입 조작 (제너릭, 조건부타입, infer)](https://munak.tistory.com/162)
- ✏️[[TS] 유틸리티(Utility) 타입](https://munak.tistory.com/165)
- ✏️[[TS] 타입이 추론되는 String.prototype.split - 1](https://munak.tistory.com/166)
- ✏️[[TS] 타입이 추론되는 String.prototype.split - 2](https://munak.tistory.com/170)
- ✏️[[TS] DeepMerge 타입 구현해보기](https://munak.tistory.com/172)
- ✏️[[TS] extends와 implements](https://munak.tistory.com/191)
- ✏️[[TS] Greater Than 타입 구현해보기 - 1](https://munak.tistory.com/198)
- ✏️[[TS] Greater Than 타입 구현해보기 - 2](https://munak.tistory.com/199)

<br>

### TDD

TDD의 개념을 배우고 좋은 테스트 코드가 무엇인지 고민해볼 수 있었습니다.

**학습 기록**

- [TDD/BDD/ATDD](https://github.com/rimo030/nestjs-e-commerce-frame/issues/34)

<br>

### TypeORM / Prisma

NestJS의 주요 ORM인 TypeORM과 Prisma를 모두 사용해 보면서, 기술 스택의 다양성을 가지게 되었습니다.

**학습 기록**

- [TypeORM의 Repository Pattern과 QueryBuilder Pattern #41](https://github.com/rimo030/nestjs-e-commerce-frame/issues/41#issue-1992859474)
- [Prisma (Migrate from TypeORM) #95](https://github.com/rimo030/nestjs-e-commerce-frame/issues/95#issue-2261681794)

<br>
