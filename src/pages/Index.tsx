import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { FAMILIES } from "@/data/families";
import { CHARACTERS, WORKS_WITH_CHARS, type Character } from "@/data/characters";

// ─── Data ───────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "hero", label: "Главная" },
  { id: "clans", label: "Кланы" },
  { id: "analysis", label: "Анализ" },
  { id: "comparison", label: "Сравнение" },
  { id: "characters", label: "Персонажи" },
  { id: "bibliography", label: "Библиография" },
];

const WORKS = [
  {
    id: "voyna",
    title: "Война и мир",
    author: "Л. Н. Толстой",
    year: "1869",
    tag: "Роман-эпопея",
    families: ["Болконские", "Ростовы", "Курагины", "Безуховы"],
    color: "#7c1c1c",
  },
  {
    id: "cherry",
    title: "Вишнёвый сад",
    author: "А. П. Чехов",
    year: "1904",
    tag: "Пьеса",
    families: ["Раневские"],
    color: "#4a6741",
  },
  {
    id: "onegin",
    title: "Евгений Онегин",
    author: "А. С. Пушкин",
    year: "1833",
    tag: "Роман в стихах",
    families: ["Ларины", "Онегины"],
    color: "#2a4a6b",
  },
  {
    id: "oblomov",
    title: "Обломов",
    author: "И. А. Гончаров",
    year: "1859",
    tag: "Роман",
    families: ["Обломовы", "Штольцы"],
    color: "#5a3e1b",
  },
];

type ComparisonRow = {
  criterion: string;
  cells: { family: string; value: string }[];
};

const WORK_COMPARISONS: Record<string, { families: { name: string; color: string }[]; rows: ComparisonRow[] }> = {
  voyna: {
    families: [
      { name: "Болконские", color: "#7c1c1c" },
      { name: "Ростовы", color: "#5a3e1b" },
      { name: "Курагины", color: "#2a4a6b" },
      { name: "Безуховы", color: "#3d6b2a" },
    ],
    rows: [
      {
        criterion: "Социальное положение",
        cells: [
          { family: "Болконские", value: "Высшая аристократия, древний род" },
          { family: "Ростовы", value: "Старинное московское дворянство" },
          { family: "Курагины", value: "Петербургская придворная знать" },
          { family: "Безуховы", value: "Богатейший граф, незаконнорождённый" },
        ],
      },
      {
        criterion: "Ценности и идеалы",
        cells: [
          { family: "Болконские", value: "Долг, честь, интеллект, гордость" },
          { family: "Ростовы", value: "Любовь, радость жизни, традиции" },
          { family: "Курагины", value: "Карьера, деньги, связи, удовольствия" },
          { family: "Безуховы", value: "Поиск смысла, духовность, любовь" },
        ],
      },
      {
        criterion: "Отношение к деньгам",
        cells: [
          { family: "Болконские", value: "Рациональное, расчётливое" },
          { family: "Ростовы", value: "Расточительное, щедрое" },
          { family: "Курагины", value: "Алчное, всё ради выгоды" },
          { family: "Безуховы", value: "Небрежное — богатство даётся случайно" },
        ],
      },
      {
        criterion: "Семейные отношения",
        cells: [
          { family: "Болконские", value: "Строгие, отдалённые, требовательные" },
          { family: "Ростовы", value: "Тёплые, близкие, эмоциональные" },
          { family: "Курагины", value: "Холодные, расчётливые, без любви" },
          { family: "Безуховы", value: "Поиск настоящей семьи через страдания" },
        ],
      },
      {
        criterion: "Судьба в произведении",
        cells: [
          { family: "Болконские", value: "Трагическая трансформация" },
          { family: "Ростовы", value: "Разорение и возрождение" },
          { family: "Курагины", value: "Крах и гибель" },
          { family: "Безуховы", value: "Духовное перерождение, счастье" },
        ],
      },
      {
        criterion: "Символ",
        cells: [
          { family: "Болконские", value: "Старый дуб — стойкость и перемены" },
          { family: "Ростовы", value: "Охота — единство и праздник" },
          { family: "Курагины", value: "Бальный зал — блеск и пустота" },
          { family: "Безуховы", value: "Звёздное небо — поиск и смысл" },
        ],
      },
    ],
  },
  cherry: {
    families: [
      { name: "Раневские", color: "#4a6741" },
      { name: "Лопахины", color: "#7a5425" },
      { name: "Симеоновы-Пищики", color: "#4a3a6b" },
    ],
    rows: [
      {
        criterion: "Социальное положение",
        cells: [
          { family: "Раневские", value: "Разорившееся старое дворянство" },
          { family: "Лопахины", value: "Новый купеческий класс, бывший крепостной" },
          { family: "Симеоновы-Пищики", value: "Обедневшее дворянство" },
        ],
      },
      {
        criterion: "Ценности и идеалы",
        cells: [
          { family: "Раневские", value: "Красота, беспечность, память о прошлом" },
          { family: "Лопахины", value: "Труд, практичность, деньги" },
          { family: "Симеоновы-Пищики", value: "Выживание, надежда на чудо" },
        ],
      },
      {
        criterion: "Отношение к деньгам",
        cells: [
          { family: "Раневские", value: "Безответственное, ностальгическое" },
          { family: "Лопахины", value: "Рациональное, деловое" },
          { family: "Симеоновы-Пищики", value: "Постоянные долги, поиск займов" },
        ],
      },
      {
        criterion: "Отношение к саду",
        cells: [
          { family: "Раневские", value: "Символ жизни, детства, любви" },
          { family: "Лопахины", value: "Актив для перепродажи под дачи" },
          { family: "Симеоновы-Пищики", value: "Чужое, стороннее" },
        ],
      },
      {
        criterion: "Судьба в пьесе",
        cells: [
          { family: "Раневские", value: "Потеря имения, отъезд в Париж" },
          { family: "Лопахины", value: "Покупка сада, новый хозяин жизни" },
          { family: "Симеоновы-Пищики", value: "Неожиданное спасение — аренда земли" },
        ],
      },
      {
        criterion: "Символ",
        cells: [
          { family: "Раневские", value: "Вишнёвый сад — уходящее прошлое" },
          { family: "Лопахины", value: "Топор — конец старого мира" },
          { family: "Симеоновы-Пищики", value: "Долговые расписки" },
        ],
      },
    ],
  },
  onegin: {
    families: [
      { name: "Ларины", color: "#2a4a6b" },
      { name: "Онегины", color: "#6b2a4a" },
      { name: "Ленские", color: "#3d6b2a" },
    ],
    rows: [
      {
        criterion: "Социальное положение",
        cells: [
          { family: "Ларины", value: "Провинциальное дворянство" },
          { family: "Онегины", value: "Петербургский светский молодой человек" },
          { family: "Ленские", value: "Молодой романтический помещик" },
        ],
      },
      {
        criterion: "Ценности и идеалы",
        cells: [
          { family: "Ларины", value: "Уклад, природа, душевность" },
          { family: "Онегины", value: "Скука, разочарование, ум без цели" },
          { family: "Ленские", value: "Романтика, поэзия, идеализм" },
        ],
      },
      {
        criterion: "Семейный уклад",
        cells: [
          { family: "Ларины", value: "Патриархальный, простой, тёплый" },
          { family: "Онегины", value: "Светский, одинокий, без корней" },
          { family: "Ленские", value: "Мечтательный, литературный" },
        ],
      },
      {
        criterion: "Отношение к любви",
        cells: [
          { family: "Ларины", value: "Искренняя, жертвенная (Татьяна)" },
          { family: "Онегины", value: "Холодное, позднее осознание" },
          { family: "Ленские", value: "Пылкое, идеализированное" },
        ],
      },
      {
        criterion: "Судьба",
        cells: [
          { family: "Ларины", value: "Татьяна — замужество и тихая трагедия" },
          { family: "Онегины", value: "Одиночество, запоздалое раскаяние" },
          { family: "Ленские", value: "Гибель на дуэли" },
        ],
      },
      {
        criterion: "Символ",
        cells: [
          { family: "Ларины", value: "Деревенский дом — покой и природа" },
          { family: "Онегины", value: "Петербургский кабинет — пустота" },
          { family: "Ленские", value: "Могила под дубами — нерасцветший талант" },
        ],
      },
    ],
  },
  oblomov: {
    families: [
      { name: "Обломовы", color: "#5a3e1b" },
      { name: "Штольцы", color: "#2a5a4a" },
      { name: "Пшеницыны", color: "#4a2a5a" },
    ],
    rows: [
      {
        criterion: "Социальное положение",
        cells: [
          { family: "Обломовы", value: "Старинное провинциальное дворянство" },
          { family: "Штольцы", value: "Смешанное — немецкий отец, русская мать" },
          { family: "Пшеницыны", value: "Мещанство, вдова чиновника" },
        ],
      },
      {
        criterion: "Ценности и идеалы",
        cells: [
          { family: "Обломовы", value: "Покой, сытость, мечта без действия" },
          { family: "Штольцы", value: "Деятельность, труд, рациональность" },
          { family: "Пшеницыны", value: "Домашний уют, забота, простота" },
        ],
      },
      {
        criterion: "Отношение к труду",
        cells: [
          { family: "Обломовы", value: "Лень возведена в принцип" },
          { family: "Штольцы", value: "Труд — смысл существования" },
          { family: "Пшеницыны", value: "Бытовой, безропотный" },
        ],
      },
      {
        criterion: "Воспитание детей",
        cells: [
          { family: "Обломовы", value: "Баловство, защита от всего" },
          { family: "Штольцы", value: "Строгое, деятельное, с ранних лет" },
          { family: "Пшеницыны", value: "Незаметное, растворённое в быту" },
        ],
      },
      {
        criterion: "Судьба в романе",
        cells: [
          { family: "Обломовы", value: "Тихое угасание, смерть от апатии" },
          { family: "Штольцы", value: "Успешная жизнь, но внутренняя пустота" },
          { family: "Пшеницыны", value: "Становятся «обломовским раем»" },
        ],
      },
      {
        criterion: "Символ",
        cells: [
          { family: "Обломовы", value: "Диван — покой и гибель" },
          { family: "Штольцы", value: "Дорога — движение и цель" },
          { family: "Пшеницыны", value: "Кухня — уют без смысла" },
        ],
      },
    ],
  },
};

const CHARACTERS = [
  {
    name: "Наташа Ростова",
    work: "Война и мир",
    role: "Главная героиня",
    traits: ["Искренность", "Жизнелюбие", "Интуиция"],
    quote: "Весь мир разделён для меня на две половины: одна — она, и там всё счастье, надежда, свет...",
    symbol: "🌺",
  },
  {
    name: "Андрей Болконский",
    work: "Война и мир",
    role: "Главный герой",
    traits: ["Гордость", "Поиск смысла", "Честь"],
    quote: "Надо жить, надо любить, надо верить.",
    symbol: "⚔️",
  },
  {
    name: "Любовь Раневская",
    work: "Вишнёвый сад",
    role: "Главная героиня",
    traits: ["Сентиментальность", "Беспечность", "Элегия"],
    quote: "О, мой милый, мой нежный, прекрасный сад!",
    symbol: "🌸",
  },
  {
    name: "Татьяна Ларина",
    work: "Евгений Онегин",
    role: "Главная героиня",
    traits: ["Искренность", "Долг", "Мечтательность"],
    quote: "Я вас люблю — к чему лукавить?",
    symbol: "📖",
  },
];

const BIBLIOGRAPHY = [
  {
    author: "Толстой Л. Н.",
    title: "Война и мир",
    year: "1869",
    publisher: "Русский вестник",
    type: "Первоисточник",
  },
  {
    author: "Эйхенбаум Б. М.",
    title: "Лев Толстой. Семидесятые годы",
    year: "1960",
    publisher: "Советский писатель, Л.",
    type: "Монография",
  },
  {
    author: "Чехов А. П.",
    title: "Вишнёвый сад",
    year: "1904",
    publisher: "Знание",
    type: "Первоисточник",
  },
  {
    author: "Катаев В. Б.",
    title: "Проза Чехова: проблемы интерпретации",
    year: "1979",
    publisher: "МГУ, М.",
    type: "Исследование",
  },
  {
    author: "Лотман Ю. М.",
    title: "Роман А. С. Пушкина «Евгений Онегин»",
    year: "1983",
    publisher: "Просвещение, Л.",
    type: "Комментарий",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Index() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("hero");
  const [activeWork, setActiveWork] = useState("voyna");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"table" | "cards">("table");
  const [charFilter, setCharFilter] = useState("all");
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredBib = BIBLIOGRAPHY.filter(
    (b) =>
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--parchment)", fontFamily: "'Golos Text', sans-serif" }}>

      {/* ── Navigation ── */}
      <nav
        style={{
          background: "rgba(245, 239, 224, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--parchment-dark)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 22, color: "var(--gold)" }}>✦</span>
            <div>
              <div
                style={{
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.9rem",
                  letterSpacing: "0.15em",
                  color: "var(--ink)",
                  fontWeight: 600,
                }}
              >
                ЛИТЕРА
              </div>
              <div style={{ fontSize: "0.6rem", color: "var(--sepia)", letterSpacing: "0.12em" }}>
                ИССЛЕДОВАТЕЛЬСКИЙ ПОРТАЛ
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-item ${activeSection === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            style={{
              fontFamily: "'Cormorant SC', serif",
              fontSize: "0.7rem",
              color: "var(--sepia)",
              letterSpacing: "0.1em",
              border: "1px solid var(--gold)",
              padding: "4px 12px",
            }}
          >
            РЕЦЕНЗИРУЕМЫЙ
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" className="relative overflow-hidden" style={{ minHeight: "90vh" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(https://cdn.poehali.dev/projects/8b465ba0-e0a4-428c-bc9c-aae099dbb6f9/files/7cc10080-8496-41de-b729-6000acb32de6.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(245,239,224,1) 40%, rgba(245,239,224,0.4) 100%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 flex items-center" style={{ minHeight: "90vh" }}>
          <div style={{ maxWidth: 620 }}>
            <div
              className="animate-fade-in-up stagger-1 flex items-center gap-3 mb-6"
              style={{ color: "var(--sepia)", fontSize: "0.75rem", letterSpacing: "0.2em", fontFamily: "'Cormorant SC', serif" }}
            >
              <span style={{ width: 32, height: 1, background: "var(--gold)", display: "inline-block" }} />
              НАУЧНОЕ ИССЛЕДОВАНИЕ · 2024
              <span style={{ width: 32, height: 1, background: "var(--gold)", display: "inline-block" }} />
            </div>

            <h1
              className="animate-fade-in-up stagger-2"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                fontWeight: 300,
                lineHeight: 1.1,
                color: "var(--ink)",
                marginBottom: 24,
              }}
            >
              Семья в русской
              <br />
              <em style={{ fontStyle: "italic", color: "var(--sepia)" }}>классической</em>
              <br />
              литературе
            </h1>

            <p
              className="animate-fade-in-up stagger-3"
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.8,
                color: "var(--ink-light)",
                marginBottom: 32,
                maxWidth: 500,
              }}
            >
              Сравнительный анализ образов семей в произведениях Толстого, Чехова, Пушкина и Гончарова.
              Глубокое исследование ценностей, конфликтов и судеб семейных кланов.
            </p>

            <div className="animate-fade-in-up stagger-4 flex gap-8 mb-10">
              {[
                { n: "4", label: "произведения" },
                { n: "12", label: "семейных кланов" },
                { n: "38", label: "персонажей" },
              ].map((stat) => (
                <div key={stat.n}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2.2rem",
                      fontWeight: 600,
                      color: "var(--sepia)",
                      lineHeight: 1,
                    }}
                  >
                    {stat.n}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--ink-light)", letterSpacing: "0.05em" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="animate-fade-in-up stagger-5 flex gap-4 flex-wrap">
              <button
                onClick={() => scrollTo("comparison")}
                style={{
                  background: "var(--ink)",
                  color: "var(--parchment)",
                  fontFamily: "'Cormorant SC', serif",
                  letterSpacing: "0.1em",
                  fontSize: "0.8rem",
                  padding: "12px 28px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--ink-light)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--ink)")}
              >
                СРАВНИТЬ СЕМЬИ
              </button>
              <button
                onClick={() => scrollTo("analysis")}
                style={{
                  background: "transparent",
                  color: "var(--ink)",
                  fontFamily: "'Cormorant SC', serif",
                  letterSpacing: "0.1em",
                  fontSize: "0.8rem",
                  padding: "12px 28px",
                  border: "1px solid var(--gold)",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,150,12,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                ЧИТАТЬ АНАЛИЗ
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 30,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            color: "var(--sepia)",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            fontFamily: "'Cormorant SC', serif",
            animation: "fadeIn 1s ease 1s forwards",
            opacity: 0,
          }}
        >
          ЛИСТАТЬ
          <div style={{ width: 1, height: 36, background: "var(--gold)" }} />
        </div>
      </section>

      {/* ── Clans ── */}
      <section id="clans" className="py-20" style={{ background: "#ede5d0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="ornament-line mb-4">
              <span style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--sepia)" }}>
                СЕМЕЙНЫЕ КЛАНЫ
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "var(--ink)", marginBottom: 12 }}>
              Анализ: семейные кланы
            </h2>
            <p style={{ color: "var(--ink-light)", fontSize: "0.95rem", maxWidth: 480, margin: "0 auto" }}>
              Выберите произведение — кланы обновятся
            </p>
          </div>

          {/* Work switcher */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {WORKS.map((work) => (
              <button
                key={work.id}
                onClick={() => setActiveWork(work.id)}
                style={{
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  padding: "8px 20px",
                  border: `1px solid ${activeWork === work.id ? work.color : "var(--parchment-dark)"}`,
                  background: activeWork === work.id ? work.color : "transparent",
                  color: activeWork === work.id ? "var(--parchment)" : "var(--ink-light)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                {work.title}
              </button>
            ))}
          </div>

          {(() => {
            const activeFamilies = FAMILIES.filter((f) => f.workId === activeWork);
            const cols = activeFamilies.length <= 2 ? activeFamilies.length : activeFamilies.length <= 3 ? 3 : 4;
            return (
              <div
                key={activeWork}
                className="animate-fade-in"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gap: 20,
                }}
              >
                {activeFamilies.map((family, i) => (
                  <div
                    key={family.id}
                    style={{
                      background: "white",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(26,18,8,0.08)",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      borderTop: `4px solid ${family.color}`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(26,18,8,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(26,18,8,0.08)";
                    }}
                    onClick={() => navigate(`/family/${family.id}`)}
                  >
                    <div style={{ height: 150, overflow: "hidden", position: "relative" }}>
                      <img
                        src={family.image}
                        alt={family.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${family.color}cc 0%, transparent 60%)` }} />
                      <div style={{ position: "absolute", bottom: 10, left: 14, fontSize: "1.8rem" }}>{family.emblem}</div>
                    </div>
                    <div style={{ padding: "18px 20px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 600, color: family.color, marginBottom: 4 }}>
                        {family.name}
                      </h3>
                      <div style={{ fontSize: "0.72rem", color: "var(--sepia)", fontStyle: "italic", marginBottom: 10 }}>
                        {family.subtitle}
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.65, flex: 1 }}>
                        {family.shortDesc}
                      </p>
                      <button
                        style={{
                          marginTop: 14,
                          background: family.color,
                          color: "var(--parchment)",
                          border: "none",
                          padding: "8px 16px",
                          fontFamily: "'Cormorant SC', serif",
                          fontSize: "0.7rem",
                          letterSpacing: "0.1em",
                          cursor: "pointer",
                          alignSelf: "flex-start",
                        }}
                      >
                        ИЗУЧИТЬ СЕМЬЮ →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── Analysis ── */}
      <section id="analysis" className="py-20" style={{ background: "var(--parchment)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="ornament-line mb-4">
              <span style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--sepia)" }}>
                РАЗДЕЛ I
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "var(--ink)", marginBottom: 12 }}>
              Произведения и семьи
            </h2>
            <p style={{ color: "var(--ink-light)", fontSize: "0.95rem", maxWidth: 500, margin: "0 auto" }}>
              Выберите произведение для детального изучения семейных образов
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {WORKS.map((work) => (
              <button
                key={work.id}
                onClick={() => setActiveWork(work.id)}
                style={{
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  padding: "8px 20px",
                  border: `1px solid ${activeWork === work.id ? work.color : "var(--parchment-dark)"}`,
                  background: activeWork === work.id ? work.color : "transparent",
                  color: activeWork === work.id ? "var(--parchment)" : "var(--ink-light)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                {work.title}
              </button>
            ))}
          </div>

          {WORKS.filter((w) => w.id === activeWork).map((work) => (
            <div
              key={work.id}
              className="animate-fade-in paper-texture"
              style={{
                background: "white",
                padding: "40px 48px",
                borderTop: `4px solid ${work.color}`,
                boxShadow: "0 4px 30px rgba(26,18,8,0.08)",
              }}
            >
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <span
                        style={{
                          color: work.color,
                          borderColor: work.color,
                          fontSize: "0.65rem",
                          letterSpacing: "0.12em",
                          fontFamily: "'Cormorant SC', serif",
                          border: "1px solid",
                          padding: "2px 10px",
                        }}
                      >
                        {work.tag}
                      </span>
                      <h3
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "2rem",
                          fontWeight: 500,
                          color: "var(--ink)",
                          marginTop: 12,
                          marginBottom: 4,
                          lineHeight: 1.2,
                        }}
                      >
                        {work.title}
                      </h3>
                      <p style={{ color: "var(--sepia)", fontSize: "0.9rem", fontStyle: "italic" }}>
                        {work.author}, {work.year}
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--parchment-dark)", paddingTop: 20 }}>
                    <div
                      style={{
                        fontFamily: "'Cormorant SC', serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.15em",
                        color: "var(--sepia)",
                        marginBottom: 12,
                      }}
                    >
                      СЕМЕЙНЫЕ КЛАНЫ
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {work.families.map((f) => (
                        <span
                          key={f}
                          style={{
                            background: `${work.color}15`,
                            border: `1px solid ${work.color}40`,
                            color: work.color,
                            padding: "4px 14px",
                            fontSize: "0.85rem",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontStyle: "italic",
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  {work.id === "voyna" && (
                    <>
                      <blockquote style={{ marginBottom: 20 }}>
                        «Всё, всё, что было, всё, что есть, и всё, что будет — всё это я. Я — это всё...»
                      </blockquote>
                      <p style={{ color: "var(--ink-light)", fontSize: "0.9rem", lineHeight: 1.75 }}>
                        В романе-эпопее Толстой противопоставляет три семейных модели: аристократическую строгость
                        Болконских, сердечную открытость Ростовых и расчётливый цинизм Курагиных. Семья как
                        микрокосм России, переживающей войну и переустройство.
                      </p>
                    </>
                  )}
                  {work.id === "cherry" && (
                    <>
                      <blockquote style={{ marginBottom: 20 }}>
                        «О, мой милый, мой нежный, прекрасный сад! Моя жизнь, моя молодость, счастье моё, прощай!»
                      </blockquote>
                      <p style={{ color: "var(--ink-light)", fontSize: "0.9rem", lineHeight: 1.75 }}>
                        Чехов изображает семью Раневских как воплощение уходящей дворянской культуры.
                        Вишнёвый сад — это не просто имение, но образ памяти, детства и невозможности
                        вернуться к прошлому.
                      </p>
                    </>
                  )}
                  {work.id === "onegin" && (
                    <>
                      <blockquote style={{ marginBottom: 20 }}>
                        «Татьяна — русская душою, сама не зная почему с её холодною красою любила русскую зиму.»
                      </blockquote>
                      <p style={{ color: "var(--ink-light)", fontSize: "0.9rem", lineHeight: 1.75 }}>
                        Семья Лариных у Пушкина — это идеал патриархального провинциального дворянства.
                        Мать-Ларина, когда-то романтическая барышня, стала образцовой помещицей.
                        Дочери унаследовали разные грани её натуры.
                      </p>
                    </>
                  )}
                  {work.id === "oblomov" && (
                    <>
                      <blockquote style={{ marginBottom: 20 }}>
                        «Обломовка — вот моё отечество!»
                      </blockquote>
                      <p style={{ color: "var(--ink-light)", fontSize: "0.9rem", lineHeight: 1.75 }}>
                        Гончаров исследует две противоположные модели существования через семьи
                        Обломовых и Штольцев: патриархальный покой vs деятельная немецкая практичность.
                        Обломовщина как культурный феномен, порождённый семейным воспитанием.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section id="comparison" className="py-20" style={{ background: "#ede5d0" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="ornament-line mb-4">
              <span style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--sepia)" }}>
                РАЗДЕЛ II
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "var(--ink)", marginBottom: 12 }}>
              Сравнительный анализ семей
            </h2>
            <p style={{ color: "var(--ink-light)", fontSize: "0.95rem" }}>
              Переключайте произведение — таблица обновляется автоматически
            </p>
          </div>

          {/* Work switcher */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {WORKS.map((work) => (
              <button
                key={work.id}
                onClick={() => setActiveWork(work.id)}
                style={{
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  padding: "8px 20px",
                  border: `1px solid ${activeWork === work.id ? work.color : "var(--parchment-dark)"}`,
                  background: activeWork === work.id ? work.color : "transparent",
                  color: activeWork === work.id ? "var(--parchment)" : "var(--ink-light)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                {work.title}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex justify-center gap-2 mb-8">
            {(["table", "cards"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  padding: "7px 20px",
                  border: "1px solid var(--gold)",
                  background: activeTab === t ? "var(--ink)" : "transparent",
                  color: activeTab === t ? "var(--parchment)" : "var(--ink)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                {t === "table" ? "ТАБЛИЦА" : "КАРТОЧКИ"}
              </button>
            ))}
          </div>

          {(() => {
            const cmp = WORK_COMPARISONS[activeWork];
            const work = WORKS.find((w) => w.id === activeWork)!;
            if (!cmp) return null;

            if (activeTab === "table") {
              return (
                <div key={activeWork} className="animate-fade-in" style={{ overflowX: "auto", boxShadow: "0 4px 30px rgba(26,18,8,0.12)" }}>
                  <table className="comparison-table" style={{ width: "100%", borderCollapse: "collapse", background: "white" }}>
                    <thead>
                      <tr>
                        <th style={{ background: "var(--ink)", minWidth: 160 }}>Критерий</th>
                        {cmp.families.map((f) => (
                          <th key={f.name} style={{ background: f.color, minWidth: 180 }}>
                            {f.name}<br />
                            <span style={{ fontWeight: 400, fontSize: "0.7rem", opacity: 0.7 }}>{work.title}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cmp.rows.map((row, i) => (
                        <tr key={i}>
                          <td
                            style={{
                              fontFamily: "'Cormorant SC', serif",
                              fontSize: "0.78rem",
                              letterSpacing: "0.05em",
                              color: "var(--sepia)",
                              fontWeight: 600,
                              background: "rgba(139,105,20,0.04)",
                              borderRight: "1px solid var(--parchment-dark)",
                            }}
                          >
                            {row.criterion}
                          </td>
                          {row.cells.map((cell, j) => (
                            <td key={j} style={{ borderRight: j < row.cells.length - 1 ? "1px solid var(--parchment-dark)" : "none" }}>
                              {cell.value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }

            return (
              <div key={activeWork} className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(cmp.families.length, 4)}, 1fr)`, gap: 16 }}>
                {cmp.families.map((family) => {
                  const firstRow = cmp.rows.find((r) => r.cells.find((c) => c.family === family.name));
                  const valuesRow = cmp.rows.find((r) => r.criterion.toLowerCase().includes("ценности"));
                  return (
                    <div
                      key={family.name}
                      className="lit-card"
                      style={{
                        background: "white",
                        padding: "24px",
                        borderTop: `4px solid ${family.color}`,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1.35rem",
                          fontWeight: 600,
                          color: family.color,
                          marginBottom: 4,
                        }}
                      >
                        {family.name}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--sepia)", marginBottom: 14, fontStyle: "italic" }}>
                        {work.title}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {cmp.rows.map((row) => {
                          const cell = row.cells.find((c) => c.family === family.name);
                          if (!cell) return null;
                          return (
                            <div key={row.criterion}>
                              <div style={{ fontSize: "0.65rem", color: "var(--sepia)", fontFamily: "'Cormorant SC', serif", letterSpacing: "0.08em", marginBottom: 2 }}>
                                {row.criterion.toUpperCase()}
                              </div>
                              <div style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.5 }}>
                                {cell.value}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── Characters ── */}
      <section id="characters" className="py-20" style={{ background: "var(--parchment)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="ornament-line mb-4">
              <span style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--sepia)" }}>
                РАЗДЕЛ III
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "var(--ink)", marginBottom: 12 }}>
              Галерея персонажей
            </h2>
            <p style={{ color: "var(--ink-light)", fontSize: "0.95rem" }}>
              Ключевые образы русской литературной классики
            </p>
          </div>

          <div
            className="grid md:grid-cols-2 gap-6"
            style={{
              backgroundImage: `url(https://cdn.poehali.dev/projects/8b465ba0-e0a4-428c-bc9c-aae099dbb6f9/files/aae7fdac-5a46-4bc4-81ef-5b146b512085.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: "2px",
            }}
          >
            {CHARACTERS.map((char, i) => (
              <div
                key={char.name}
                className="lit-card animate-fade-in-up"
                style={{
                  background: "rgba(245,239,224,0.97)",
                  padding: "28px 28px",
                  animationDelay: `${i * 0.12}s`,
                  opacity: 0,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      background: "var(--parchment-dark)",
                      flexShrink: 0,
                      border: "1px solid var(--gold)",
                    }}
                  >
                    {char.symbol}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.3rem",
                        fontWeight: 600,
                        color: "var(--ink)",
                        marginBottom: 2,
                      }}
                    >
                      {char.name}
                    </h3>
                    <div style={{ fontSize: "0.78rem", color: "var(--sepia)", fontStyle: "italic", marginBottom: 12 }}>
                      {char.role} · {char.work}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {char.traits.map((t) => (
                        <span
                          key={t}
                          style={{
                            background: "var(--parchment-dark)",
                            color: "var(--ink-light)",
                            padding: "2px 10px",
                            fontSize: "0.75rem",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <blockquote style={{ fontSize: "0.88rem", borderLeftWidth: 2, paddingLeft: 14, marginTop: 0 }}>
                      {char.quote}
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bibliography ── */}
      <section id="bibliography" className="py-20" style={{ background: "#ede5d0" }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="ornament-line mb-4">
              <span style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--sepia)" }}>
                РАЗДЕЛ IV
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, color: "var(--ink)", marginBottom: 12 }}>
              Библиография
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid var(--gold)",
              padding: "10px 16px",
              background: "white",
              marginBottom: 24,
            }}
          >
            <Icon name="Search" size={16} />
            <input
              type="text"
              placeholder="Поиск по автору или названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                fontFamily: "'Golos Text', sans-serif",
                fontSize: "0.9rem",
                background: "transparent",
                color: "var(--ink)",
              }}
            />
          </div>

          <div style={{ background: "white", boxShadow: "0 4px 20px rgba(26,18,8,0.08)" }}>
            {filteredBib.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: "18px 24px",
                  borderBottom: i < filteredBib.length - 1 ? "1px solid var(--parchment-dark)" : "none",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 16,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(139,105,20,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 500, color: "var(--ink)" }}>
                    {item.author}
                  </span>
                  <span style={{ color: "var(--ink-light)", fontSize: "0.9rem" }}>
                    {" "}— <em>{item.title}</em>
                  </span>
                  <span style={{ color: "var(--sepia)", fontSize: "0.85rem" }}>
                    {" "}/ {item.publisher}, {item.year}
                  </span>
                </div>
                <span
                  style={{
                    color: "var(--sepia)",
                    borderColor: "var(--sepia)",
                    whiteSpace: "nowrap",
                    fontSize: "0.65rem",
                    fontFamily: "'Cormorant SC', serif",
                    letterSpacing: "0.1em",
                    border: "1px solid",
                    padding: "2px 10px",
                  }}
                >
                  {item.type}
                </span>
              </div>
            ))}
            {filteredBib.length === 0 && (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--ink-light)", fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--ink)", color: "var(--parchment)", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "1.2rem", letterSpacing: "0.2em", marginBottom: 8 }}>
          ЛИТЕРА
        </div>
        <div style={{ fontSize: "0.75rem", color: "rgba(245,239,224,0.5)", letterSpacing: "0.1em", marginBottom: 20 }}>
          ИССЛЕДОВАТЕЛЬСКИЙ ПОРТАЛ
        </div>
        <div style={{ width: 40, height: 1, background: "var(--gold)", margin: "0 auto 20px" }} />
        <p style={{ fontSize: "0.8rem", color: "rgba(245,239,224,0.6)", maxWidth: 400, margin: "0 auto" }}>
          Научные материалы, анализ и сравнение семейных образов в русской классической литературе
        </p>
      </footer>
    </div>
  );
}