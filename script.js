let isOrderAccepted = false;
let isValetFound = false;
let hasRestaurantSeenYourOrder = false;
let restaurantTimer = null;
let valetTimer = null;
let isOrderDelivered = false;
let valetDeliveryTimer = false; 

//Zomato App - Boot up/Power Up/start...accept or reject order
window.addEventListener('load',function(){
    this.document.getElementById('acceptOrder').addEventListener('click', function(){
        askRestaurantToAcceptOrReject();
    });
    document.getElementById('findValet').addEventListener('click', function(){
        startSearchingForValets();
    })
    this.document.getElementById('DeliverOrder').addEventListener('click',function(){
        setTimeout(()=>{
            isOrderDelivered = true;
    },2000)
});


        checkIfOrderAcceptedByRestaurantOrNot()
        .then(isOrderAccepted=>{
            console.log('updated from restaurant - ',isOrderAccepted);

            //step-Start Preparing

            if(isOrderAccepted) 
            startPreparingOrder();

            //step 3 - order rejected
            
            else  alert("Sorry Restaurant closed"); 
            })
            .catch(err=>{
            console.error(err);
            alert("Something went wrong! Please Try Again Later");
        })
    });
 

        // console.log(res);


//step 1 Check Whether restaurant accepted order or not

function askRestaurantToAcceptOrReject(){
    //callback
    setTimeout(()=>{
        isOrderAccepted = confirm('Should restaurant accept order?');
        hasRestaurantSeenYourOrder = true;
        // console.log(isOrderAccepted);
    },1000);
    //promise - resolve or reject
    
}

//step 2-Check if Restaurant has accepted order

function checkIfOrderAcceptedByRestaurantOrNot(){
    return new Promise((resolve, reject) => {
        restaurantTimer = setInterval(()=>{
            console.log('checking if order accepted or not');
            if(!hasRestaurantSeenYourOrder) {
                return;
            }
            
            if(isOrderAccepted){
                resolve(true);
            }
            else{
                resolve(false);
            }

            clearInterval(restaurantTimer);
        },2000);
       
    });   
}

function startPreparingOrder(){
    Promise.allSettled([
        updateOrderStatus(),
        updateMapView(),
        checkIfValetAssigned(),
        checkIfOrderDelivered()
    ])
    .then(res =>{
        console.log(res);
        setTimeout(()=>{
            alert("How was your food? Rate your food and delivery partner");
        },2000);
    })
    .catch(err =>{
        console.error(err);
    })
}

//Helper functions - Pure functions //ek he kaam k lye bane hain

function updateOrderStatus(){
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            document.getElementById('currentStatus').innerText = isOrderDelivered ? 'Order Delivered successfully':'Preparing your order!';
            resolve('status updated');
        },1500);
    })
    
}

function updateMapView(){
    // throw new Error('jaan booch kr map fail kardo');
    //Fake Delay to get data
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            document.getElementById('mapview').style.opacity = '1';
            // reject('map not initailised');
            resolve('map is initialized');
        },1000);
    });
    
}

function startSearchingForValets(){
    //BED
    //Bht complex operations:-

    /**
     * 1. Get all locations of nearby valets
     * 2. Sort the valets based on shortest path of restaurant + to customer home.
     * 3. Select the valet with shortest distance and minimum orders
     * 
     */

    //step1 - get valets

    const valetsPromises = [];

    for(let i = 0;i<5;i++){
        valetsPromises.push(getRandomDriver());
    }
    console.log(valetsPromises);

    Promise.any(valetsPromises)
    .then(selectedValet =>{
        console.log('Selected a valet =>' ,selectedValet);
        isValetFound = true;
    })
    .catch(err=>{
        console.error(err);
    })

}

function getRandomDriver(){
    //Fake delay to get location from riders
    return new Promise((resolve,reject)=>{
        const timeout = Math.random()*1000;
        setTimeout(()=>{
            resolve('Valet - ' +timeout);
        },timeout)
    })
}

function checkIfValetAssigned(){
    return new Promise((resolve,reject)=>{
        valetTimer = setInterval(()=>{
            console.log(' Searching For Valet');
            if(isValetFound){
                updateValetDetails();
                resolve('upadted valet details');
                clearTimeout(valetTimer);
            }

        },1000);
    })

}

function checkIfOrderDelivered(){
    return new Promise((resolve,reject)=>{
        valetDeliveryTimer = setInterval(()=>{
            console.log(' Is Order delivered by valet');
            if(isOrderDelivered){
                resolve('order delivered valet details');
                updateOrderStatus();
                clearTimeout(valetDeliveryTimer);
            }

        },1000);
    })

}

function updateValetDetails(){
    if(isValetFound){
        document.getElementById('finding-driver').classList.add('none');
        document.getElementById('found-driver').classList.remove('none');
        document.getElementById('call').classList.remove('none');
    }

}
