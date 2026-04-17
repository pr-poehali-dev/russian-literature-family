import { useParams, useNavigate } from "react-router-dom";
import { FAMILIES, FamilyMember } from "@/data/families";
import Icon from "@/components/ui/icon";

// ── Family Tree SVG Component ─────────────────────────────────────────────

function FamilyTree({ members, color }: { members: FamilyMember[]; color: string }) {
  const roots = members.filter((m) => !m.parentIds || m.parentIds.length === 0);
  const children = members.filter((m) => m.parentIds && m.parentIds.length > 0);

  const getMember = (id: string) => members.find((m) => m.id === id);

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 500, padding: "20px 0" }}>
        {/* Generation 1 - roots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 0 }}>
          {roots.map((m) => {
            const spouse = m.spouseId ? getMember(m.spouseId) : null;
            return (
              <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TreeNode member={m} color={color} />
                  {spouse && (
                    <>
                      <div style={{ width: 24, height: 1, background: color, opacity: 0.4 }} />
                      <TreeNode member={spouse} color={color} secondary />
                    </>
                  )}
                </div>
                {/* Connector down */}
                {children.some((c) => c.parentIds?.includes(m.id)) && (
                  <div style={{ width: 1, height: 32, background: color, opacity: 0.3, marginTop: 4 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Generation 2 */}
        {children.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 0 }}>
            {children.map((m) => {
              const spouse = m.spouseId ? getMember(m.spouseId) : null;
              const hasKids = members.some((c) => c.parentIds?.includes(m.id));
              return (
                <div key={m.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <TreeNode member={m} color={color} />
                    {spouse && (
                      <>
                        <div style={{ width: 16, height: 1, background: color, opacity: 0.4 }} />
                        <TreeNode member={spouse} color={color} secondary />
                      </>
                    )}
                  </div>
                  {hasKids && (
                    <div style={{ width: 1, height: 28, background: color, opacity: 0.3, marginTop: 4 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Generation 3 — grandchildren */}
        {(() => {
          const gen2ids = children.map((c) => c.id);
          const gen3 = members.filter((m) => m.parentIds?.some((pid) => gen2ids.includes(pid)));
          if (!gen3.length) return null;
          return (
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 0 }}>
              {gen3.map((m) => (
                <TreeNode key={m.id} member={m} color={color} />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function TreeNode({ member, color, secondary = false }: { member: FamilyMember; color: string; secondary?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        maxWidth: 120,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `2px solid ${secondary ? color + "60" : color}`,
          background: secondary ? "white" : `${color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
        }}
      >
        {member.role.toLowerCase().includes("жена") || member.role.toLowerCase().includes("дочь") || member.role.toLowerCase().includes("мать") ? "👩" : "👤"}
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "0.75rem",
          textAlign: "center",
          color: secondary ? "var(--ink-light)" : "var(--ink)",
          lineHeight: 1.3,
          fontWeight: secondary ? 400 : 600,
        }}
      >
        {member.name.split(" ").slice(0, 2).join(" ")}
      </div>
      <div style={{ fontSize: "0.6rem", color: "var(--sepia)", textAlign: "center", lineHeight: 1.2 }}>
        {member.lifespan}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function FamilyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const family = FAMILIES.find((f) => f.id === id);

  if (!family) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "var(--sepia)" }}>
            Семья не найдена
          </p>
          <button onClick={() => navigate("/")} style={{ marginTop: 16, color: "var(--crimson)", cursor: "pointer", background: "none", border: "none", fontFamily: "'Golos Text', sans-serif" }}>
            ← На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--parchment)", minHeight: "100vh", fontFamily: "'Golos Text', sans-serif" }}>

      {/* ── Back nav ── */}
      <div
        style={{
          background: "rgba(245,239,224,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid var(--parchment-dark)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "14px 24px",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "var(--ink-light)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Cormorant SC', serif",
              fontSize: "0.78rem",
              letterSpacing: "0.08em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--sepia)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-light)")}
          >
            <Icon name="ArrowLeft" size={14} />
            ВЕРНУТЬСЯ
          </button>
          <div style={{ fontFamily: "'Cormorant SC', serif", fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--sepia)" }}>
            {family.work}
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div
        style={{
          position: "relative",
          height: 340,
          overflow: "hidden",
        }}
      >
        <img
          src={family.image}
          alt={family.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, rgba(26,18,8,0.85) 0%, rgba(26,18,8,0.3) 60%, transparent 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 0,
            right: 0,
          }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{family.emblem}</div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 300,
                color: "var(--parchment)",
                lineHeight: 1,
                marginBottom: 8,
              }}
            >
              {family.name}
            </h1>
            <p style={{ color: "rgba(245,239,224,0.7)", fontStyle: "italic", fontSize: "1rem" }}>
              {family.subtitle} · {family.work}
            </p>
          </div>
        </div>
        {/* Color accent bar */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: family.color }} />
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Short desc */}
        <div
          style={{
            borderLeft: `4px solid ${family.color}`,
            paddingLeft: 20,
            marginBottom: 48,
          }}
        >
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", lineHeight: 1.7, color: "var(--ink)", fontStyle: "italic" }}>
            {family.shortDesc}
          </p>
        </div>

        {/* Two-col: lifestyle + values */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div
            style={{
              background: "white",
              padding: "28px",
              borderTop: `3px solid ${family.color}`,
              boxShadow: "0 2px 16px rgba(26,18,8,0.06)",
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "var(--sepia)",
                marginBottom: 14,
              }}
            >
              УКЛАД ЖИЗНИ
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "var(--ink-light)" }}>
              {family.lifestyleDesc}
            </p>
          </div>
          <div
            style={{
              background: "white",
              padding: "28px",
              borderTop: `3px solid ${family.color}`,
              boxShadow: "0 2px 16px rgba(26,18,8,0.06)",
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant SC', serif",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "var(--sepia)",
                marginBottom: 14,
              }}
            >
              ЦЕННОСТИ
            </div>
            <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "var(--ink-light)" }}>
              {family.valuesDesc}
            </p>
          </div>
        </div>

        {/* Family tree */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle>Генеалогическое древо</SectionTitle>
          <div
            style={{
              background: "white",
              padding: "32px",
              boxShadow: "0 2px 16px rgba(26,18,8,0.06)",
              border: "1px solid var(--parchment-dark)",
            }}
          >
            <FamilyTree members={family.members} color={family.color} />

            {/* Members list */}
            <div style={{ borderTop: "1px solid var(--parchment-dark)", marginTop: 24, paddingTop: 20 }}>
              <div
                style={{
                  fontFamily: "'Cormorant SC', serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.15em",
                  color: "var(--sepia)",
                  marginBottom: 12,
                }}
              >
                ЧЛЕНЫ СЕМЬИ
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {family.members.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      padding: "6px 0",
                      borderBottom: "1px dotted var(--parchment-dark)",
                    }}
                  >
                    <div>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.95rem", fontWeight: 600, color: "var(--ink)" }}>
                        {m.name}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--ink-light)", marginLeft: 8, fontStyle: "italic" }}>
                        {m.role}
                      </span>
                    </div>
                    {m.lifespan && (
                      <span style={{ fontSize: "0.72rem", color: "var(--sepia)", flexShrink: 0, marginLeft: 8 }}>
                        {m.lifespan}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Key events */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle>Ключевые события</SectionTitle>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 16,
                top: 0,
                bottom: 0,
                width: 2,
                background: `linear-gradient(to bottom, ${family.color}, ${family.color}20)`,
              }}
            />
            <div style={{ paddingLeft: 48, display: "flex", flexDirection: "column", gap: 0 }}>
              {family.events.map((ev, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    paddingBottom: 28,
                    animation: `fadeInUp 0.5s ease ${i * 0.08}s both`,
                  }}
                >
                  {/* Dot */}
                  <div
                    style={{
                      position: "absolute",
                      left: -40,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: family.color,
                      border: "2px solid var(--parchment)",
                    }}
                  />
                  <div
                    style={{
                      background: "white",
                      padding: "16px 20px",
                      boxShadow: "0 2px 10px rgba(26,18,8,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 10, marginBottom: 6 }}>
                      <span
                        style={{
                          fontFamily: "'Cormorant SC', serif",
                          fontSize: "0.68rem",
                          letterSpacing: "0.1em",
                          color: family.color,
                          border: `1px solid ${family.color}`,
                          padding: "2px 8px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.volume}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--sepia)", fontStyle: "italic", alignSelf: "center" }}>
                        {ev.chapter}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                      {ev.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Relations */}
        <section style={{ marginBottom: 48 }}>
          <SectionTitle>Связи с другими семьями</SectionTitle>
          <div className="grid md:grid-cols-3 gap-4">
            {family.relations.map((rel, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  padding: "20px",
                  borderLeft: `3px solid ${family.color}`,
                  boxShadow: "0 2px 12px rgba(26,18,8,0.06)",
                  transition: "transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  {rel.family}
                </div>
                <div
                  style={{
                    fontFamily: "'Cormorant SC', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    color: family.color,
                    marginBottom: 10,
                  }}
                >
                  {rel.type.toUpperCase()}
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--ink-light)", lineHeight: 1.6 }}>
                  {rel.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Other families */}
        <section>
          <SectionTitle>Другие семьи</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FAMILIES.filter((f) => f.id !== family.id).map((f) => (
              <button
                key={f.id}
                onClick={() => navigate(`/family/${f.id}`)}
                style={{
                  background: "white",
                  border: `1px solid var(--parchment-dark)`,
                  padding: "16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s",
                  borderTop: `3px solid ${f.color}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,18,8,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{f.emblem}</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 600, color: f.color }}>
                  {f.name}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--ink-light)", marginTop: 2 }}>
                  Изучить →
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div className="ornament-line">
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "var(--ink)",
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </h2>
      </div>
    </div>
  );
}
