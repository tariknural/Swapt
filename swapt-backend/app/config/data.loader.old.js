const db = require("../models");
const bcrypt = require("bcryptjs");
const csv = require('csv-parser');
const fs = require('fs');
const https = require('https');

// Init UserRole Collection
const dbConfig = require("../config/db.config");

function initStart() {
    db.mongoose
        .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Successfully connect to MongoDB.");
            // Init dummy data
            basicDatabaseDataInit();
        })
        .catch((err) => {
            console.error("Connection error", err);
            process.exit();
        });
}

// MongoDB connection

const UserRole = db.userrole;
const City = db.city;
const Country = db.country;
const University = db.university;
const User = db.user;
const Accommodation = db.accommodation;
const CommentsOfCountry = db.commentsOfCountry;
const Comment = db.comment;

let GermanyCountryId = "";
let SwedenCountryId = "";
let MunichCityId = "";
let StockholmCityId = "";
let TUMUniversityId = "";
let LMUUniversityId = "";
let SUUniveristyId = "";
let FUSUniveristyId = "";
let UserIds = [];

/**
 * Init basic database data.
 * This will only be triggered if the database is empty.
 * To generate the dummy data, delete all collections in your mongoDB database.
 */
function basicDatabaseDataInit() {
    Country.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Country({
                name: "Germany",
                housingInformation: "There are various types of accommodation in Germany that are suitable for students. Although universities in Germany offer student accommodation, demand far outstrips supply, so many students choose to rent privately.\n\nMost universities in Germany offer several halls of residence for their students. These are almost always run by the Deutsches Studentenwerk. There are usually several types of accommodation available to suit all preferences, from 1-bedroom apartments to flatshares of up to 20 students.\n\nInstead of opting for university accommodation, plenty of students in Germany choose to rent privately. Renting a place to yourself will usually cost significantly more than university accommodation, and you will have to take care of things like utility bills and internet connection yourself. If you’re looking to save costs, taking a room in a flatshare (Wohngemeinschaft) is usually a very affordable option (and a great way to practice your German!)\n\n",
                generalInformation: "Germany is a country in Central and Western Europe. Covering an area of 357,022 square kilometres (137,847 sq mi), it lies between the Baltic and North seas to the north, and the Alps to the south. It borders Denmark to the north, Poland and the Czech Republic to the east, Austria and Switzerland to the south, and France, Luxembourg, Belgium, and the Netherlands to the west.\n\nVarious Germanic tribes have inhabited the northern parts of modern Germany since classical antiquity. A region named Germania was documented before AD 100. Beginning in the 10th century, German territories formed a central part of the Holy Roman Empire. During the 16th century, northern German regions became the centre of the Protestant Reformation. After the collapse of the Holy Roman Empire, the German Confederation was formed in 1815. In 1871, Germany became a nation state when most of the German states unified into the Prussian-dominated German Empire. After World War I and the German Revolution of 1918–1919, the Empire was replaced by the parliamentary Weimar Republic. The Nazi seizure of power in 1933 led to the establishment of a dictatorship, World War II, and the Holocaust. After the end of World War II in Europe and a period of Allied occupation, two new German states were founded: West Germany and East Germany. The Federal Republic of Germany was a founding member of the European Economic Community and the European Union. The country was reunified on 3 October 1990.\n\nToday, Germany is a federal parliamentary republic led by a chancellor. With 83 million inhabitants of its 16 constituent states, it is the second-most populous country in Europe after Russia, as well as the most populous member state of the European Union. Its capital and largest city is Berlin, and its financial centre is Frankfurt; the largest urban area is the Ruhr.\n\nGermany is a great power with a strong economy; it has the largest economy in Europe, the world's fourth-largest economy by nominal GDP, and the fifth-largest by PPP. As a global leader in several industrial and technological sectors, it is both the world's third-largest exporter and importer of goods. A highly developed country with a very high standard of living, it offers social security and a universal health care system, environmental protections, and a tuition-free university education. Germany is also a member of the United Nations, NATO, the G7, the G20, and the OECD. Known for its long and rich cultural history, Germany has many World Heritage sites and is among the top tourism destinations in the world.",
                legalInformation: "Although they vary in length, tenancy agreements (Mietverträge) in Germany usually follow a standard form that is the same for all different housing types. This means they often contain provisions that do not necessarily apply to your specific situation. Before signing, you should read your contract carefully to make sure you understand all of its terms.\n\nAlthough oral agreements are, in principle, legally binding, they are much harder to prove. It is therefore wise to conclude a tenancy agreement in writing in case any disagreements arise.There are two types of tenancy agreements in Germany: fixed-term (befristet) and indefinite (unbefristet).\n\nA fixed-term contract specifies a move-in and move-out date. It is not necessarily renewed upon its expiry. You will commonly come across these in student housing, where a room is let only for the duration of the academic year, or term.\n\nAn indefinite contract has no end date. Tenants have the right to end indefinite contracts by providing notice, whereas landlords are fairly restricted and cannot terminate indefinite contracts without good reason\n\nAn indefinite contract has no end date. Tenants have the right to end indefinite contracts by providing notice, whereas landlords are fairly restricted and cannot terminate indefinite contracts without good reason.\n\nYour rental contract will set out exactly how much rent you are expected to pay. It will usually specify a payment date and a preferred method of payment. The most common way of paying your rent is by transferring it to your landlord’s bank account.\n\nYour rent will either be “cold” (Kaltmiete - rent only) or “warm” (Warmmiete - including service costs for the building and sometimes utilities (Nebenkosten) such as gas, electricity, service costs, internet and phone bills). Make sure you understand what is and is not included, to avoid any unexpected costs in future.\n\nYour tenancy agreement will also lay out any provision for future rent increases. Legally, your landlord cannot increase your rent within the first 12 months of your tenancy contract, or by more than 20% (15% in some federal states) over a three-year period.\n\nSome landlords, therefore, charge “stepped rent” (Staffelmiete), that increases gradually over time.  A schedule for any rent increases will be included in your tenancy agreement. It is worth noting that, if your landlord charges you stepped rent, additional rent increases are not permitted.\n\nRenters usually have to pay a deposit before moving in, to protect the landlord against any damage or non-payment of rent. The exact amount will be specified in your tenancy agreement, but it legally cannot exceed three months’ rent.\n\nThe landlord is obliged to keep your deposit separate from their other assets, for example by putting it in a special savings account. At the end of your tenancy, your landlord must pay back the deposit, plus any interest accrued in the meantime.",
                culturalInformation: "The culture of Germany has been shaped by major intellectual and popular currents in Europe, both religious and secular. Historically, Germany has been called Das Land der Dichter und Denker (the country of poets and thinkers).\n\nThere are a number of public holidays in Germany. The country is particularly known for its Oktoberfest celebrations in Munich, its carnival culture and globally influential Christmas customs known as Weihnachten. 3 October has been the national day of Germany since 1990, celebrated as the German Unity Day (Tag der Deutschen Einheit). The UNESCO inscribed 38 properties in Germany on the World Heritage List.\n\nGermany was the world's second most respected nation among 50 countries in 2013.[5] A global opinion poll for the BBC revealed that Germany is recognized for having the most positive influence in the world in 2011, 2013, and 2014.",
                banner_picture: "http://localhost:8080/public/pictures/country/germany.jpg",
                flag_picture: "http://localhost:8080/public/pictures/country/flag/germany.png",
            }).save((err, country) => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'Germany' to country collection");

                GermanyCountryId = country._id;

                new City({
                    name: "Munich",
                    banner_picture: "http://localhost:8080/public/pictures/city/munich.jpg",
                    country: country._id,
                }).save((err, city) => {
                    if (err) {
                        console.log("error", err);
                    }

                    console.log("added 'Munich' to city collection");

                    MunichCityId = city._id;

                    new University({
                        web_pages: ["http://www.tum.de/"],
                        name: "Technische Universität München",
                        domains: ["tum.de", "tum.edu"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        TUMUniversityId = university._id;

                        console.log(
                            "added 'Technische Universität München' to university collection"
                        );
                    });

                    new University({
                        web_pages: ["http://www.uni-muenchen.de/"],
                        name: "Ludwig-Maximilians-Universität München",
                        domains: ["uni-muenchen.de"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        LMUUniversityId = university._id;

                        console.log(
                            "added 'Ludwig-Maximilians-Universität München' to university collection"
                        );
                    });

                    new University({
                        web_pages: ["http://www.fh-muenchen.de/"],
                        name: "Fachhochschule München",
                        domains: ["fh-muenchen.de"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Fachhochschule München' to university collection"
                        );
                    });
                });
                new City({
                    name: "Berlin",
                    banner_picture: "http://localhost:8080/public/pictures/city/berlin.jpg",
                    country: country._id,
                }).save((err, city) => {
                    if (err) {
                        console.log("error", err);
                    }

                    console.log("added 'Berlin' to city collection");

                    new University({
                        web_pages: ["https://www.htw-berlin.de/"],
                        name: "Hochschule für Technik und Wirtschaft Berlin",
                        domains: ["fhtw-berlin.de", "htw-berlin.de"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Hochschule für Technik und Wirtschaft Berlin' to university collection"
                        );
                    });

                    new University({
                        web_pages: ["http://www.fu-berlin.de/"],
                        name: "Freie Universität Berlin",
                        domains: ["fu-berlin.de"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Freie Universität Berlin' to university collection"
                        );
                    });

                    new University({
                        web_pages: ["http://www.hu-berlin.de/"],
                        name: "Humboldt Universität Berlin",
                        domains: ["hu-berlin.de"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Humboldt Universität Berlin' to university collection"
                        );
                    });
                });
            });

            new Country({
                name: "Sweden",
                housingInformation: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.\n\nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.\n\nUt wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.\n\nNam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.\n\nDuis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.\n\nAt vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur.",
                generalInformation: "Lorem ipsum dolor sit amet, quaeque feugiat eam et, qui solet noluisse euripidis in. Quo ut autem voluptatum. An eam denique necessitatibus. Natum nominati et eos. Pri mutat tibique corpora te, ad sumo qualisque qui, usu te illud movet. Mel dicam electram id, in prima scaevola verterem sit.\n\nMeis novum torquatos per ne, eius fuisset expetendis ad eum. Ad vel stet docendi, cu nec dicit deseruisse disputationi. Quo legendos argumentum id. Pri probo appetere interpretaris ex. Et est vero epicurei.\n\nQuot efficiantur ne est, eos alia dicat concludaturque cu, usu cu porro dicam. Ex habeo nulla indoctum duo, mei lorem gubergren ea, sit te elitr argumentum necessitatibus. No aeterno nusquam est, docendi civibus ut eos. Utamur placerat indoctum cu est, ludus audiam partiendo vis ne. Elit paulo choro pri cu, ad his hinc bonorum imperdiet.\n\nEripuit conceptam argumentum eam eu, eu erant viris nam. Prima perfecto legendos cum eu. Cum te vide iudico reprimique, quo porro lobortis efficiantur te, te brute exerci pericula qui. Error facete in quo. Est agam sale quidam id.\n\nNe aeterno partiendo concludaturque nam. In eius periculis dissentiet vel. Aperiam detraxit per an, ne vix sadipscing philosophia, eam ei everti consectetuer. Hinc patrioque vituperata est id, quod repudiare hendrerit qui no. Eu modo tation nostrud vix.\n\nCibo adhuc dicunt sit no, sit id oblique numquam. Ut sea error recusabo partiendo, his eu probo efficiantur, ei diam omnesque pro. Id eros deleniti nam, modus graecis volumus cu mea. Pri id mazim dictas efficiantur, nam ex eius ocurreret adipiscing.\n\nUsu id gloriatur sententiae. Has sint tritani ad, est in moderatius dissentiet. Magna eruditi ne eam, nec et solet detraxit. Debet sententiae nec ei. Assum eruditi ex eum, ei nostrum consectetuer qui. Maluisset dignissim abhorreant pro ne, ut iudico omnesque vel, te vim liber diceret nusquam.\n\nCu epicuri splendide.",
                legalInformation: "Lorem ipsum dolor sit amet, duo verterem dissentias suscipiantur ei, persius voluptaria id per, omnes congue putent vel et. Graeci moderatius eam te. Usu soluta sapientem splendide id, cu sea minim virtute verterem. Ne has modus assum tantas, detracto eleifend sed te. Id aliquando complectitur qui, nam mediocrem periculis ad, eos at purto libris.\n\nVel utinam posidonium contentiones cu, cu nam harum dicant. Ut rebum nominati suscipiantur cum, pri veniam sadipscing ea, aeterno maiorum ut ius. Mea an luptatum theophrastus, semper putant expetendis te sea, at dolor disputationi sit. Pri virtute fuisset mediocrem an, his minimum scriptorem signiferumque ne.\n\nAperiri constituto sit an. Eum ut eligendi menandri, eam vero vivendum ne. Has no modo atqui vivendum, mei no modo diam scripserit. Facer munere accusata eam cu.\n\nHas alii partiendo ex, erat antiopam neglegentur sit ea, te per sumo noster impedit. Vis nobis fabellas philosophia ex, nam vocent albucius definitiones et. Tamquam probatus duo no, nisl dolorum eloquentiam quo eu. Ea sed diam legere tamquam, id atqui inani nec, petentium appellantur eam ad. Eos ornatus percipit an, velit ceteros antiopam mei an, fugit denique has ne.\n\nUtinam viderer molestie no eum, vis no fierent placerat. In eos viris sensibus postulant. Ut usu tamquam detraxit accommodare, in illum honestatis ullamcorper ius, ex latine aperiam eum. Vix aperiam perpetua at.\n\nUt eos oporteat accusata rationibus, pro doctus persequeris ullamcorper in, cetero probatus vix ex. Cu nulla albucius referrentur mea, vim ut iudicabit temporibus, augue viderer similique et quo. Has te nisl dignissim, integre deseruisse in duo. Eos congue nemore ei, etiam sapientem pro eu.\n\nSint modus iudicabit est ex, erant oratio audiam ius an, ad pri impetus dolorum luptatum. Duo id tamquam lucilius perpetua, ea quo ubique definitionem, in luptatum antiopam nam. Te idque qualisque torquatos mei, no duo option copiosae constituto, ex audire offendit cotidieque eum. Summo alienum deserunt no has, semper dissentias ad nec.\n\nUtroque epicurei eos in. Pri in quaeque complectitur, cum ad enim imperdiet. No mea prima intellegat scripserit. Nostro mandamus at quo. Ut wisi alienum vim, an ancillae gloriatur temporibus eum. His nihil persecuti et, nobis patrioque te mea, ad aliquam constituto vis.\n\nEu sed quando scriptorem delicatissimi. Ut dicant adipiscing mei. Has putent antiopam hendrerit an, ex rebum possim imperdiet est, per an mentitum interesset. Feugiat maluisset te quo, ut mea timeam voluptatum, per cu labore electram constituto. Iusto definitionem id sed, eos saepe temporibus cu, qui oratio lobortis corrumpit te. Cum alii graeci pertinacia ei, impedit insolens et vel.\n\nDico decore volutpat at duo. Viderer nusquam dissentiet in est, has te equidem delenit, vim ut graecis tacimates. Ius ea everti iriure antiopam, ius ea melius pertinax scriptorem, quo feugiat electram cu. Animal option comprehensam pri ex.",
                culturalInformation: "Lorem ipsum dolor sit amet, noluisse antiopam pertinacia te vel. Unum democritum adolescens quo id. Id malorum explicari vix. Vix at augue ubique, vix te civibus deserunt, sit intellegat eloquentiam ex. Dicam omittam comprehensam et ius, amet postulant ad duo, ei viris dolores per.\n\nNo tamquam nostrud sit. Veniam impetus viderer ius eu, duo affert semper adolescens ut. Eam eirmod intellegat et. Id mei habemus torquatos, illud evertitur at nec, mel an ferri suscipit.\n\nNec erat ubique sensibus an, id libris fabulas vel. Equidem delicata pericula duo eu, at ius populo putent philosophia. Pri augue argumentum te, vel ferri oratio vocent eu. Nec augue eirmod in, at magna prodesset interesset per. Et vim duis vituperata dissentiunt.\n\nScaevola maluisset assentior pro te. His an unum soleat, ne his solet regione impedit. At eos mucius singulis. Fugit numquam platonem ne his. Sed in prima senserit, tamquam fabellas has ea.\n\nTantas offendit expetenda sed eu, ea pri aeque vidisse pertinax. Sed cu nostro albucius, an elit reformidans nec, sonet causae ei eum. Et wisi nemore eirmod qui, eu sed dicam exerci equidem. Primis epicuri recteque id qui.\n\nHis an partem similique constituam, eos ad minimum voluptua facilisis, his dolorem atomorum ocurreret an. Ex error meliore fierent mel. Possit philosophia pro eu, mea errem graecis ex, pri posse dissentias cu. Nam at lorem viris persius, et usu etiam laoreet. Id mel repudiare reprehendunt, cum nisl populo cu, appetere ocurreret democritum et usu. Cu ludus deseruisse sed, eam magna invidunt ei.\n\nUtinam aperiri iuvaret ad sed. At duo animal legendos deseruisse, ut ius homero utamur. Ei omnis utroque vel, pro nulla gubergren id. Posse vituperata ad sit, qui fabulas graecis reprimique ne. Quod appetere deterruisset at pro, nec te causae euismod. At nam solet menandri deserunt, ea usu utinam invenire efficiantur.\n\nEi impedit facilis nominavi pro, qui id quidam labores periculis. Qui reque movet putant an, eum cu amet tation. Eu his atqui utroque civibus, te eos enim assueverit. Animal dolores intellegebat in pri, esse erant no vis. Eu eos vivendo interpretaris, his in velit veniam.\n\nEst ne oratio scaevola, cetero corrumpit conclusionemque eu eam. Te graeci scriptorem omittantur quo, id pro graece denique praesent. Usu eius putent te. In volumus hendrerit vim. Ne gubergren voluptatum nec, vim iriure sensibus reformidans ei. An modo insolens voluptatibus mei.\n\nUt nec atomorum disputando, ut magna molestie accusamus duo. Movet dolore volumus in mea. Quem vidisse eu pri.",
                banner_picture: "http://localhost:8080/public/pictures/country/sweden.jpg",
                flag_picture: "http://localhost:8080/public/pictures/country/flag/sweden.png",
            }).save((err, country) => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'Sweden' to country collection");

                SwedenCountryId = country._id;

                new City({
                    name: "Stockholm",
                    banner_picture: "http://localhost:8080/public/pictures/city/stockholm.jpg",
                    country: country._id,
                }).save((err, city) => {
                    if (err) {
                        console.log("error", err);
                    }

                    StockholmCityId = city._id;

                    console.log("added 'Stockholm' to city collection");

                    new University({
                        web_pages: ["http://www.su.se/"],
                        name: "Stockholm University",
                        domains: ["su.se"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        SUUniveristyId = university._id;

                        console.log(
                            "added 'Stockholm University' to university collection"
                        );
                    });

                    new University({
                        web_pages: ["http://www.stockholm-fu.com/"],
                        name: "Free University Stockholm",
                        domains: ["stockholm-fu.com"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        FUSUniveristyId = university._id;

                        console.log(
                            "added 'Free University Stockholm' to university collection"
                        );
                    });

                    new University({
                        web_pages: ["http://www.hhs.se/"],
                        name: "Stockholm School of Economics",
                        domains: ["hhs.se"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Stockholm School of Economics' to university collection"
                        );
                    });
                });
                new City({
                    name: "Gothenburg",
                    banner_picture: "http://localhost:8080/public/pictures/city/gothenburg.jpg",
                    country: country._id,
                }).save((err, city) => {
                    if (err) {
                        console.log("error", err);
                    }

                    console.log("added 'Gothenburg' to city collection");

                    new University({
                        web_pages: ["http://www.gu.se/"],
                        name: "University of Gothenburg",
                        domains: ["gu.se"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'University of Gothenburg' to university collection"
                        );
                    });

                    new University({
                        web_pages: ["http://www.chalmers.se/"],
                        name: "Chalmers University of Technology",
                        domains: ["chalmers.se"],
                        country: country._id,
                        city: city._id,
                    }).save((err, university) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Chalmers University of Technology' to university collection"
                        );

                        // Create User and Accommodation Dummy
                        userAndAccommodationInit();
                    });
                });
            });

            loadAllCountriesWithFlags();
        }
    });
}

// Init Role
function userAndAccommodationInit() {
    UserRole.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new UserRole({
                name: "premiumUser",
            }).save((err) => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'premiumUser' to roles collection");
            });

            new UserRole({
                name: "user",
            }).save((err, role) => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");

                new User({
                    email: "max.mustermann@tum.de",
                    password: bcrypt.hashSync("password", 8),
                    first_name: "Max",
                    last_name: "Mustermann",
                    profile_picture: "http://localhost:8080/public/pictures/profile/faec8c82-c21e-47b4-ade1-af14be3da2ae-id1_cn@2x.png",
                    home_university: TUMUniversityId,
                    destination_university: SUUniveristyId,
                    home_city: MunichCityId,
                    destination_city: StockholmCityId,
                    exchange_date_start: new Date("June 1, 2020 00:00:00"),
                    exchange_date_end: new Date("December 31, 2020 23:59:59"),
                    roles: [role._id],
                    is_verified_exchange_student: true,
                }).save((err, user) => {
                    if (err) {
                        console.log("error", err);
                    }

                    console.log("added 'Max Mustermann' to user collection");

                    UserIds.push(user._id);

                    new Accommodation({
                        user: user._id,
                        street: "Heßstraße",
                        street_number: 71,
                        zip_code: 80798,
                        city: MunichCityId,
                        country: GermanyCountryId,
                        additional_information: "Nice small accommodation above ramen shop",
                        size: 42,
                        rent_per_month: 690,
                        accommodation_description_title: "Title 1 Title 1Title 1Title 1Title 1Title 1Title 1",
                        accommodation_description: "Description 1 Description 1 Description 1 Description 1 Description 1 Description 1 Description 1 ",
                        pictures: [
                            "http://localhost:8080/public/pictures/accommodation/a24ee3fd-f4ee-4930-8e3c-7d3b587c236a-horn-flat.png",
                            "http://localhost:8080/public/pictures/accommodation/4f526e31-dfe3-4b1a-a45e-f0597afa7bcb-kitchen.png",
                            "http://localhost:8080/public/pictures/accommodation/d07ab1bb-3e8b-40e8-befe-7f9de493c618-robson-twin.png",
                            "http://localhost:8080/public/pictures/accommodation/6ca06ab7-82b8-4d9c-b3e1-c15894d0fea2-shared-kitchen.png",
                            "http://localhost:8080/public/pictures/accommodation/a2a61578-62b5-4d61-b8f6-8a8e63026aa3-turner-flat.png"
                        ],
                        is_verified_by_landlord: true,
                        google_map: {
                            center: {
                                lat: 59.95,
                                lng: 30.33,
                            },
                            zoom: 11,
                        },
                    }).save((err) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Max's accommodation' to accommodation collection"
                        );
                    });
                });

                new User({
                    email: "sara.younggren@su.se",
                    password: bcrypt.hashSync("password", 8),
                    first_name: "Sara",
                    last_name: "Younggren",
                    profile_picture: "http://localhost:8080/public/pictures/profile/4b6f47b6-b444-4099-887d-50fb8d435180-id1@2x.png",
                    home_university: SUUniveristyId,
                    destination_university: TUMUniversityId,
                    home_city: StockholmCityId,
                    destination_city: MunichCityId,
                    exchange_date_start: new Date("June 1, 2020 00:00:00"),
                    exchange_date_end: new Date("December 31, 2020 23:59:59"),
                    roles: [role._id],
                    is_verified_exchange_student: true,
                }).save((err, user) => {
                    if (err) {
                        console.log("error", err);
                    }

                    console.log("added 'Sara Younggren' to user collection");

                    UserIds.push(user._id);

                    new Accommodation({
                        user: user._id,
                        street: "Lützengatan",
                        street_number: 4,
                        zip_code: 11520,
                        city: StockholmCityId,
                        country: SwedenCountryId,
                        additional_information: "Nice big accommodation above sushi bar",
                        size: 121,
                        rent_per_month: 1800,
                        accommodation_description_title: "Title 2 ",
                        accommodation_description: "Description 2 ",
                        pictures: [
                            "http://localhost:8080/public/pictures/accommodation/8c2b4aab-a117-472d-9a41-1b5ffc4054ae-atkinson-twin-2.png",
                            "http://localhost:8080/public/pictures/accommodation/99d424b5-c3dd-40ac-9bfe-e4f85dd451b7-bellamy-studio.png",
                            "http://localhost:8080/public/pictures/accommodation/3dee839e-d5db-451f-a113-bdbefb46c0f4-bronte-twin.png",
                            "http://localhost:8080/public/pictures/accommodation/89da984b-d3bf-4da2-9cbe-5269c3a70d06-cookson-1.png",
                            "http://localhost:8080/public/pictures/accommodation/9eef0445-c66a-43b1-9b7e-95d3d0a56b5b-cookson-2.png"
                        ],
                        is_verified_by_landlord: true,
                        google_map: {
                            center: {
                                lat: 59.95,
                                lng: 30.33,
                            },
                            zoom: 11,
                        },
                    }).save((err) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Sara's accommodation' to accommodation collection"
                        );
                    });

                    new Accommodation({
                        user: user._id,
                        street: "Lützengatan II",
                        street_number: "4 A",
                        zip_code: "11520 AB",
                        city: StockholmCityId,
                        country: SwedenCountryId,
                        additional_information: "Some accommodation in stockholm",
                        size: 100,
                        rent_per_month: 1500,
                        accommodation_description_title: "Title 3",
                        accommodation_description: "Description 3",
                        pictures: [
                            "http://localhost:8080/public/pictures/accommodation/8c2b4aab-a117-472d-9a41-1b5ffc4054ae-atkinson-twin-2.png",
                            "http://localhost:8080/public/pictures/accommodation/99d424b5-c3dd-40ac-9bfe-e4f85dd451b7-bellamy-studio.png",
                            "http://localhost:8080/public/pictures/accommodation/3dee839e-d5db-451f-a113-bdbefb46c0f4-bronte-twin.png",
                            "http://localhost:8080/public/pictures/accommodation/89da984b-d3bf-4da2-9cbe-5269c3a70d06-cookson-1.png",
                            "http://localhost:8080/public/pictures/accommodation/9eef0445-c66a-43b1-9b7e-95d3d0a56b5b-cookson-2.png"
                        ],
                        is_verified_by_landlord: true,
                        google_map: {
                            center: {
                                lat: 59.95,
                                lng: 30.33,
                            },
                            zoom: 11,
                        },
                    }).save((err) => {
                        if (err) {
                            console.log("error", err);
                        }

                        console.log(
                            "added 'Sara's accommodation' to accommodation collection"
                        );

                        initComments();
                    });
                });
            });
        }
    });
}

function initComments() {
    new CommentsOfCountry({
        countryId: GermanyCountryId,
        informationType: "generalInformation",
        comments: [new Comment({
            comment: "I was in Germany last year and I would recommend it to everyone. It's great and especially make sure to be there in autumn and visit the Okterberfest!",
            answers: [
                new Comment({
                    comment: "Thanks for the information. I will be in Munich next Semester and I will definetely go to the Okterfest.",
                    answers: [
                    ],
                    user: UserIds[0],
                    time: new Date()
                }),
            ],
            user: UserIds[1],
            time: new Date()
            })
        ]
    }).save((err) => {
        if (err) {
            console.log("error", err);
        }

        console.log(
            "added Comments to generalInformation for Germany"
        );
    });;
}

function loadAllCountriesWithFlags(){
    fs.createReadStream('country_flags.csv')
    .pipe(csv())
    .on('data', (row) => {
        if (row.country === "Germany" || row.country === "Sweden") {return}
        const countryFlagFileName = "public/pictures/country/flag/" + row.country + ".svg";
        const countryFlagFile = fs.createWriteStream(countryFlagFileName);
        https.get(row.imageurl, response => {
            response.pipe(countryFlagFile);
        });       


        new Country({
            name: row.country,
            housingInformation: "",
            generalInformation: "",
            legalInformation: "",
            culturalInformation: "",
            banner_picture: "",
            flag_picture: "http://localhost:8080/" + countryFlagFileName,
        }).save((err, country) => {
            if (err) {
                console.log("error", err);
            }

            console.log("added " + country.name + " to country collection");
        })
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
    });
}

module.exports = {
    initStart: initStart,
};
