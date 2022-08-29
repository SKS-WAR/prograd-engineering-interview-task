const reactions = require('../data/reactions.json');

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

const run = () => {
    let allUserHM = createHMusers();

    let maxMatch = 0;
    let calcScore = {};
    for(let uid1 in allUserHM){
        for(let ui2 in allUserHM){
            if(uid1!==ui2){
                let cMatches = totalMatches(allUserHM[uid1],allUserHM[ui2]);
                if(cMatches>maxMatch){
                    maxMatch = cMatches;
                    calcScore = {
                        score: cMatches,
                        users: [uid1, ui2]
                    };
                }
                else if(cMatches === maxMatch){
                    calcScore.users.push(uid1,ui2);
                }
            }
        }
    }

    calcScore.users = calcScore.users.filter((element, index) => calcScore.users.indexOf(element) === index);
    console.log(`Highest Score : ${calcScore.score}`);
    console.log(`userId : ${calcScore.users[0]} and ${calcScore.users[1]}`);
}
run();