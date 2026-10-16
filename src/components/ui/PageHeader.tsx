export function PageHeader({ heading, intro }: { heading: string; intro?: string }) {
  return (
    <section className="kc-page-intro border-b border-[var(--kc-line)] bg-[var(--kc-cream)]">
      <div className="kc-page-intro__inner mx-auto max-w-content px-5 py-12 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <p className="kc-page-intro__eyebrow">KCMSC</p>
        <h1 className="kc-page-intro__title mt-4 max-w-4xl font-heading">{heading}</h1>
        {intro ? <p className="kc-page-intro__body mt-5 max-w-2xl">{intro}</p> : null}
      </div>
    </section>
  );
}
