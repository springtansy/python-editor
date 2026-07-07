const problems = {
    sumProblem: {

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
            { input: "199999\n199999\n", expected: "399998" },
        ]
    },

    rectangleArea: {

        title: {
            en: "Area of a Rectangle",
            sv: "Arean av en rektangel",
            fi: "Suorakulmion pinta-ala"
        },

        statement: {
            en: "Read two integers representing the side lengths of a rectangle and print its area.",
            sv: "Läs av två heltal, rektangelns sidlängder och skriv ut rektangelns area.",
            fi: "Lue kaksi kokonaislukua, suorakulmion sivujen pituudet, ja tulosta suorakulmion pinta-ala."
        },

        input: {
            en: `The first line contains one side length a.
            The second line contains the other side length b.`,
            sv: `Den första raden innehåller en sidlängd a.
            Den andra raden innehåller den andra sidlängden b.`,
            fi: `Ensimmäisellä rivillä on yhden sivun pituus a.
            Toisella rivillä on toisen sivun pituus b.`
        },

        output: {
            en: `Print one integer: the area of the rectangle.`,
            sv: `Skriv ut ett heltal: rektangelns area.`,
            fi: `Tulosta yksi kokonaisluku: suorakulmion pinta-ala.`
        },

        constraints: {
            en: `1 ≤ a, b ≤ 2000`,
            sv: `1 ≤ a, b ≤ 2000`,
            fi: `1 ≤ a, b ≤ 2000`
        },

        tests: [
            { input: "1\n1\n", expected: "1" },
            { input: "3\n2\n", expected: "6" },
            { input: "27\n19\n", expected: "513" },
            { input: "1999\n1997\n", expected: "3992003" },
            { input: "41\n13\n", expected: "533" },
            { input: "2000\n3\n", expected: "6000" },
            { input: "5\n2000\n", expected: "10000" },
            { input: "1999\n1999\n", expected: "3996001" },
        ]
    },

    numberPrinting: {

        title: {
            en: "Printing Numbers",
            sv: "Utskrivning av tal",
            fi: "Lukujen tulostus"
        },

        statement: {
            en: "Read one integer and print the positive integers from 1 to n. ",
            sv: "Läs av ett heltal, och skriv ut så många positiva heltal börjande från 1.",
            fi: "Lue yksi kokonaisluku ja tulosta niin monta positiivista kokonaislukua luvusta 1 alkaen."
        },

        input: {
            en: `The first line contains the integer n.`,
            sv: `Den första raden innehåller heltalet n.`,
            fi: `Ensimmäisellä rivillä on kokonaisluku n.`
        },

        output: {
            en: `Print n integers: 1, 2, 3, ... , n. Print one integer per line.`,
            sv: `Skriv ut n heltal: 1, 2, 3, ... , n. Skriv ut ett tal per rad.`,
            fi: `Tulosta n kokonaislukua: 1, 2, 3, ... , n. Tulosta jokaiselle riville vain yhden luvun.`
        },

        constraints: {
            en: `1 ≤ n ≤ 100`,
            sv: `1 ≤ n ≤ 100`,
            fi: `1 ≤ n ≤ 100`
        },

        tests: [
            { input: "1\n", expected: "1" },
            { input: "5\n", expected: "1\n2\n3\n4\n5" },
            { input: "10\n", expected: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10" },
            { input: "11\n", expected: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11" },
            { input: "23\n", expected: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23" },
            { input: "67\n", expected: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30\n31\n32\n33\n34\n35\n36\n37\n38\n39\n40\n41\n42\n43\n44\n45\n46\n47\n48\n49\n50\n51\n52\n53\n54\n55\n56\n57\n58\n59\n60\n61\n62\n63\n64\n65\n66\n67" },
            { input: "100\n", expected: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n21\n22\n23\n24\n25\n26\n27\n28\n29\n30\n31\n32\n33\n34\n35\n36\n37\n38\n39\n40\n41\n42\n43\n44\n45\n46\n47\n48\n49\n50\n51\n52\n53\n54\n55\n56\n57\n58\n59\n60\n61\n62\n63\n64\n65\n66\n67\n68\n69\n70\n71\n72\n73\n74\n75\n76\n77\n78\n79\n80\n81\n82\n83\n84\n85\n86\n87\n88\n89\n90\n91\n92\n93\n94\n95\n96\n97\n98\n99\n100" },
        ]
    },
}
