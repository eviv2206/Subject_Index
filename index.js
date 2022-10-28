class SubjectElement {
    description;
    page;
    children;

    constructor(description, page, children) {
        this.description = description;
        this.page = page;
        this.children = children;
    }
}

class SubjectIndex {
    subjects;

    constructor(subjects) {
        this.subjects = subjects;
    }

    #deepCount(array, padding) {
        if (Array.isArray(array)) {
            array.forEach((elem) => {
                this.#printElem(padding, elem);
                if (elem?.children) {
                    let tempPadding = padding + 1;
                    this.#deepCount(elem.children, tempPadding);
                } else {
                    this.#deepCount(elem, padding);
                }
            })
        }
    }

    #compareElem(elem, previousName, previousPage) {
        return elem.description === previousName && elem.page === +previousPage;
    }

    #updateElem(array, previousName, previousPage, newName, newPage) {
        if (Array.isArray(array)) {
            array.forEach((elem) => {
                if (this.#compareElem(elem, previousName, previousPage)) {
                    elem.description = newName;
                    elem.page = newPage;
                }
                if (elem?.children) {
                    this.#updateElem(elem.children, previousName, previousPage, newName, newPage);
                } else {
                    this.#updateElem(elem, previousName, previousPage, newName, newPage);
                }
            })
        }
        return 0;
    }

    #addElem(elem, newName, newPage, path) {
        if (path[0] !== '') {
            for (let i = 0; i < path.length; i++) {
                if (elem.length !== 0) {
                    let j = 0;
                    while (elem[j].description !== path[i]) {
                        j++;
                    }
                    elem = elem[j].children;
                }
            }
        }
        elem.push(new SubjectElement( newName, newPage, []));
    }

    #printElem(paddingCount, elem) {
        let padding = "";
        for (let i = 0; i < paddingCount; i++) {
            padding += "_____";
        }
        console.log(padding, elem.description, "______", elem.page);
    }

    showAll() {
        let padding = 0;
        this.#deepCount(this.subjects, padding);
    }

    update() {
        const previousName = prompt("Введите старое название");
        const previousPage = prompt("Введите старое значение страницы");
        const newName = prompt("Введите новое название");
        const newPage = prompt("Введите новую страницу");
        this.#updateElem(this.subjects, previousName, +previousPage, newName, +newPage);
    }

    add() {
        const newName = prompt("Введите новое название");
        const newPage = prompt("Введите новую страницу");
        let path = prompt("Введите путь:", "первый элемент/второй элемент/...")
        path = path.split("/");
        debugger;
        this.#addElem(this.subjects, newName, +newPage, path);
    }

    delete() {
        const prevName = prompt("Введите название");
        const prevPage = prompt("Введите страницу");
        debugger;
        this.#deleteSubject(this.subjects, prevName, +prevPage, this.subjects);
    }


    #deleteSubject(array, currDescription, currPage, prevElem) {
        let isDone = false;
        if (Array.isArray(array)) {
            array.forEach((elem) => {
                if (elem.description === currDescription && elem.page === currPage) {
                    if (prevElem?.children) {
                        prevElem.children = prevElem.children.filter((currElem) => currElem !== elem);
                        isDone = true;
                    } else {
                        subjectsIndex.subjects = prevElem.filter(currElem => currElem !== elem);
                        isDone = true;
                    }
                }
                if (!isDone) {
                    if (elem?.children) {
                        this.#deleteSubject(elem.children, currDescription, currPage, elem);
                    } else {
                        this.#deleteSubject(elem, currDescription, currPage, prevElem);
                    }
                }
            })
        }
    }

    #sort(array, field) {
        if (Array.isArray(array)) {
            array.sort((a, b) => a[field] > b[field] ? 1 : -1);
            array.forEach((elem) => {
                if (elem?.children) {
                    this.#sort(elem.children, field);
                } else {
                    this.#sort(elem, field);
                }
            })
        }
    }

    #findSubterms(array, currDescription) {
        if (Array.isArray(array)) {
            array.forEach((elem) => {
                if (elem.description === currDescription && elem.children !== null) {
                    elem = elem.children;
                    if (Array.isArray(elem)) {
                        elem.forEach((elem) => {
                            this.#printElem(0, elem);
                        })
                    } else {
                        this.#printElem(0, elem);
                    }
                }
                if (elem?.children) {
                    this.#findSubterms(elem.children, currDescription);
                } else {
                    this.#findSubterms(elem, currDescription);
                }
            })
        }
    }

    #findSubject(array, currDescription, prevElem) {
        if (Array.isArray(array)) {
            array.forEach((elem) => {
                if (elem.description === currDescription) {
                    this.#printElem(0, prevElem)
                }
                if (elem?.children) {
                    this.#findSubject(elem.children, currDescription, elem);
                } else {
                    this.#findSubject(elem, currDescription, prevElem);
                }
            })
        }
    }

    sortByDescription() {
        this.#sort(this.subjects, "description");
    }

    sortByPage() {
        this.#sort(this.subjects, "page");
    }

    findSubterms() {
        const description = prompt('Введите термин');
        this.#findSubterms(this.subjects, description);
    }

    findSubject() {
        const description = prompt('Введите подтермин');
        this.#findSubject(this.subjects, description, this.subjects);
    }

}


const firstThirdOneElem = new SubjectElement("Текста", 47, []);
const firstThirdTwoElem = new SubjectElement("Видеоклипа", 22, []);
const firstSecondOneElem = new SubjectElement("Вставка", 70, [firstThirdOneElem, firstThirdTwoElem]);
const secondFirstElem = new SubjectElement("Текста", 25, []);
const firstSecondTwoElem = new SubjectElement("Выравнивание", 69, [secondFirstElem]);
const firstElemOne = new SubjectElement("В", 32, [firstSecondOneElem, firstSecondTwoElem]);

const secondThirdElem = new SubjectElement("Страниц", 47, []);
const secondSecondElem = new SubjectElement("Автоформатирование", 44, [secondThirdElem]);
const secondElem = new SubjectElement("А", 52, [secondSecondElem]);

const subjectsIndex = new SubjectIndex([firstElemOne, secondElem]);
subjectsIndex.showAll();
console.log("\n");

