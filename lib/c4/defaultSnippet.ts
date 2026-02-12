export const defaultC4Snippet = `title [Containers] Информационная система ветеринарной клиники

Person(employee, "Сотрудник клиники", "Использует ИС ветеринарной клиники")

System_Boundary(clinic_system, "ИС ветеринарной клиники") {
  Container(web_app, "Веб-приложение", "Java Spring", "Позволяет сотруднику просматривать и управлять информацией о ветеринарах, клиентах и их питомцах")
  ContainerDb(db, "База данных ветеринарной клиники", "Oracle Database 12c", "Хранит информацию о ветеринарах, клиентах клиники и их питомцах")
}

System_Ext(unified_registry, "Единая ветеринарная система", "Ведёт единый реестр животных и их хозяев")

Rel(employee, web_app, "Использует", "HTTPS")
Rel(web_app, db, "Читает и пишет", "JDBC")
Rel(web_app, unified_registry, "Отправляет информацию о прививках", "HTTPS/SOAP")`;
