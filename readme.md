# eurochem-scorm

SCORM-тренажёр (React + TypeScript + Vite). Сборка пакуется в SCORM 2004 4th Edition (`imsmanifest.xml` в корне архива).

## Сборка пакета

```bash
npm install
npm run build:scorm
```

`build:scorm` выполняет три шага:

1. `npm run build` — `tsc -b && vite build`, результат в `dist/`
2. `npm run manifest` — генерирует `dist/imsmanifest.xml` из `scripts/manifest.template.xml` (скрипт `scripts/generate-manifest.js` подставляет список файлов в `{{RESOURCES}}`)
3. `npm run zip:scorm` — упаковывает `dist/` в `scorm-package.zip` в корне проекта (без вложенной папки, `imsmanifest.xml` лежит в корне архива — так требует SCORM)

Отдельно доступны `npm run manifest` и `npm run zip:scorm`, если `dist/` уже собран.

## Загрузка в SCORM Cloud

1. Открыть https://app.cloud.scorm.com/sc/user/authoring/UploadCourse
2. Выбрать файл `scorm-package.zip`
3. Нажать Import Course и дождаться обработки
4. Открыть загруженный курс и нажать Launch — SCORM Cloud запускает курс в iframe или отдельном окне, поэтому проверка через `npm run dev` локально не заменит загрузку в облако

> *Не забудьте раскомментировать useEffect в src/App.tsx перед сборкой проекта*
