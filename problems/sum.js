const Problem = {
    id: "sum",

    title: {
        en: "Sum of Two Numbers",
        sv: "Summan av två tal",
        fi: "Kahden luvun summa"
    },

    statement: {
        en: "Read two integers and print their sum.",
        sv: "Läs av två heltal och skriv ut deras summa.",
        fi: "Lue kaksi kokonaislukua ja tulosta niiden summa."
    },

    input: {
        en: `The first line contains one integer a.
        The second line contains one integer b.`,
        sv: `Den första raden innehåller ett heltal a.
        Den andra raden innehåller ett heltal b.`,
        fi: `Ensimmäisellä rivillä on yksi kokonaisluku a.
        Toisella rivillä on yksi kokonaisluku b.`
    },

    output: {
        en: `Print one integer: a + b.`,
        sv: `Skriv ut ett heltal: a + b.`,
        fi: `Tulosta yksi kokonaisluku: a + b.`
    },

    constraints: {
        en: `-2 × 10⁵ < a, b < 2 × 10⁵`,
        sv: `-2 × 10⁵ < a, b < 2 × 10⁵`,
        fi: `-2 × 10⁵ < a, b < 2 × 10⁵`
    },

    tests: [
        { input: "0\n0\n", expected: "0" },
        { input: "1\n2\n", expected: "3" },
        { input: "7981\n-191212\n", expected: "-183231" },
        { input: "-199999\n-198765\n", expected: "-398764" },
        { input: "459\n12\n", expected: "471" },
        { input: "185002\n120499\n", expected: "305501" },
        { input: "-77\n77\n", expected: "0" },
    ]
};
