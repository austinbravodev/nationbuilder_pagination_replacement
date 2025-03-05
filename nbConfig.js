document.addEventListener("DOMContentLoaded", () => {
  paginationReplacement({
    itemsContainerSelector: "#blog-page-{{ page.id }}",
    paginationContainerSelector: ".pagination",
    nextPageUrl: (pagCont) => pagCont.lastElementChild.firstElementChild.href,
    previousPageCondition: (pagCont) =>
      pagCont.firstElementChild.classList.contains("disabled"),
    nextPageCondition: (pagCont) =>
      pagCont.lastElementChild.classList.contains("disabled"),
    makeButton: (appendElement) => {
      const btnCont = document.createElement("div");
      btnCont.id = "prButtonContainer";
      btnCont.classList.add("text-center");
      btnCont.style.display = "none";

      const btn = document.createElement("button");
      btn.id = "prButton";
      btn.type = "button";
      btn.classList.add("btn", "btn-primary");
      btn.textContent = "Load More";
      btn.disabled = true;

      btnCont.append(btn);

      return {
        btn,
        btnCont,
        appendElement:
          appendElement.insertAdjacentElement("afterend", btnCont) ??
          appendElement,
      };
    },
    makeMessages: (appendElement) => {
      const msgsCont = document.createElement("div");
      msgsCont.id = "prMessagesContainer";
      msgsCont.classList.add(
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "text-muted",
        "small",
        "mt-2",
      );

      msgsCont.style.setProperty("display", "none", "important");

      const msgsLoadIcon = document.createElement("span");
      msgsLoadIcon.id = "prMessagesIcon";
      msgsLoadIcon.classList.add("spinner-border", "spinner-border-sm", "mr-1");
      msgsLoadIcon.role = "status";
      msgsLoadIcon.setAttribute("aria-hidden", "true");
      msgsLoadIcon.style.display = "none";

      const msgs = document.createElement("span");
      msgs.id = "prMessages";

      msgsCont.append(msgsLoadIcon, msgs);
      appendElement.insertAdjacentElement("afterend", msgsCont);

      return { msgs, msgsCont, msgsLoadIcon };
    },
    messagesContainerHide: (msgsCont) => {
      msgsCont.style.setProperty("display", "none", "important");
    },
    loadAll: true,
  });
});
