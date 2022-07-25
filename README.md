# vue-express-mono-repo-template

Original template from [vuejs-forge-boilerplate](https://github.com/vueschool/vuejs-forge-boilerplate)

## Instruction

1. Install dependencies with
```
pnpm install -r
```

2. Start docker compose
```
docker compose up -d
```

3. Migrate database 
```
pnpm --filter backend run db:fresh
```

3. (optional) fake database
```
pnpm --filter backend run db:fake
```

4. Start dev server
```
pnpm run start
```

## path

- /
- /report


## Technology stack

- pnpm
- mongoDB
- vue 3

## Strength of Microfrontend

ทำให้แต่ละ feature มีทีมที่รับผิดชอบขัดเจน ทำให้ทุก ๆ ทีมพยายามทำ feature ที่รับผิดชอบให้ดีที่สุดสำหรับผู้ใช้งาน

