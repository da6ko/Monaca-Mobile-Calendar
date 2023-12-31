const firebaseConfig = {
"<database_config_information>"
};

firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();

const db = firestore.collection("Collection_Name");

let nav = 0;
let clicked = null; 
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : []; 

const calendar = document.getElementById('calendar'); 
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'];


function openModal(date) {
  clicked = date;
  
  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

function load() {

  localStorage.setItem('events', JSON.stringify(events));



  const dt = new Date(); 

  if (nav !== 0) {  
    dt.setMonth(new Date().getMonth() + nav);  
  }

  const day = dt.getDate(); 
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate(); 

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);


  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('bg-BG', { month: 'long' })} ${year}`;

    calendar.innerHTML = ''; 

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {

    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;
    
    if (i > paddingDays) { 
      daySquare.innerText = i - paddingDays; 
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString)); 
    } else { 
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);   
  }
}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    let databaseDate = clicked
    let databaseTitle = eventTitleInput.value
    db.doc().set({
      date:databaseDate,
      title:databaseTitle
    }).then( () => {
      console.log("Data Saved")
    }).catch((error) => {
      console.log(error)
    })
    

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked); 
  localStorage.setItem('events', JSON.stringify(events)); 

  db.where("date", "==", clicked).get()
  .then(querySnapshot => {
    querySnapshot.forEach((doc) => {
      doc.ref.delete().then(() => {
        console.log("Document successfully deleted!");
      }).catch(function(error) {
        console.error("Error removing document: ", error);
      });
    });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });

  closeModal();
}

function initButtons() { 
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}


function getDatabaseInformation(){
  db.get().then((querySnapshot) => {
    querySnapshot.docs.forEach(doc =>{
      events.push(doc.data());
    });
  });
}



getDatabaseInformation();
initButtons();
setTimeout(load, 2000);


