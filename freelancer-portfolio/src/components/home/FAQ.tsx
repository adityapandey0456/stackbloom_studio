const questions = [
  {
    question: "How do I start a project?",
    answer:
      "Submit the enquiry form with your requirements and preferred timeline. Aditya will review your request and discuss the next steps with you.",
  },
  {
    question: "How much will my project cost?",
    answer:
      "The quotation depends on the scope, features and complexity. The price will be confirmed after your requirements have been reviewed.",
  },
  {
    question: "How long will the project take?",
    answer:
      "A delivery schedule will be agreed before work begins. Timing depends on the project scope, availability and when the required content and feedback are received.",
  },
  {
    question: "Can you improve an existing website?",
    answer:
      "You can request website fixes or improvements through the enquiry form. Include the website address and a description of the changes you need.",
  },
  {
    question: "Are revisions included?",
    answer:
      "The number and scope of revisions will be agreed in the quotation. Additional features or changes outside the agreed scope may require a separate estimate.",
  },
  {
    question: "How are payments and handover handled?",
    answer:
      "Payment milestones, deliverables and handover arrangements will be agreed before the project starts. Any hosting, domain or third-party service costs will also be clarified.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="section container"
      aria-labelledby="faq-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">BEFORE WE GET STARTED</p>
          <h2 id="faq-heading">A few useful answers.</h2>
        </div>

        <p className="section-description">
          Have a specific question? Share it through the project
          enquiry form.
        </p>
      </div>

      <div className="faq-list">
        {questions.map((item) => (
          <details className="faq-item" key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}