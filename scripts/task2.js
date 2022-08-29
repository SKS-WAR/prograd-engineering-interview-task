const reactions = require('../data/reactions.json');
const jobs = require('../data/jobs.json');

const createHMusers = () => {
    let userHM = {};

    const likedJobs = reactions.filter((item)=>item.direction);

    likedJobs.forEach(ele => {
        if(userHM[ele.user_id]!=undefined){
            userHM[ele.user_id].push(ele.job_id);
        }
        else{
            userHM[ele.user_id] = [ele.job_id];
        }
    });

    return userHM;
}

const totalMatches = (user1, user2) => {

    let jobsMatch = [];
    for(let i = 0; i<user1.length;i++){
        if(user2.indexOf(user1[i])!==-1){
            jobsMatch.push(user1[i]);
        }
    }

    return jobsMatch.filter((ele, index)=> jobsMatch.indexOf(ele) === index).length;
}

const getCompaniesByJobs = () => {
    let companiesJobsMap = {};
    jobs.forEach((element) => {
        if(companiesJobsMap[element.company_id]){
            companiesJobsMap[element.company_id].push(element.job_id);
        }
        else{
            companiesJobsMap[element.company_id] = [element.job_id];
        }
    });
    return companiesJobsMap;
};


const createCompanyApplicantHM = () => {
    const usersJobMap = createHMusers();
    const companiesJobsMap = getCompaniesByJobs();
    const comapnyApplicantMap = {}

    for(let company_id in companiesJobsMap){
        for(let user_id in usersJobMap){
            const companyJobs = companiesJobsMap[company_id];
            const userLikingJobs = usersJobMap[user_id];

            const doesJobMatch = companyJobs.some(element => userLikingJobs.indexOf(element)>=0);
            if(doesJobMatch && comapnyApplicantMap[company_id]){
                comapnyApplicantMap[company_id].push(user_id);
            }
            else if(doesJobMatch){
                comapnyApplicantMap[company_id] = [user_id];
            }
        }
    }
    return comapnyApplicantMap;
}

const run = () => {
    const companyApplicantHM = createCompanyApplicantHM();
    let maxMatch = 0;
    let calcScore={};

    for(let company_id1 in companyApplicantHM){
        for(let company_id2 in companyApplicantHM){
            if(company_id1!==company_id2){
                const matchingCompany = totalMatches(companyApplicantHM[company_id1], companyApplicantHM[company_id2]);
                if(matchingCompany > maxMatch){
                    maxMatch = matchingCompany;
                    calcScore.score = maxMatch;
                    calcScore.companies = [company_id1, company_id2];
                }
                else if(matchingCompany == maxMatch){
                    calcScore.companies.push(company_id1, company_id2);
                }
            }
        }
    }

    calcScore.companies = calcScore.companies.filter((element, index) => calcScore.companies.indexOf(element) === index);
    console.log(`Highest Score : ${calcScore.score}`);
    console.log(`companiesId : ${calcScore.companies[0]} and ${calcScore.companies[1]}`);
}

run();