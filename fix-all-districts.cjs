const fs = require('fs');
const path = 'src/data/india-states-districts.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const additions = {
  'Uttar Pradesh': [
    'Agra','Aligarh','Ambedkar Nagar','Amethi','Amroha','Auraiya','Ayodhya','Azamgarh','Baghpat','Bahraich',
    'Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bhadohi','Bijnor','Budaun','Bulandshahr',
    'Chandauli','Chitrakoot','Deoria','Etah','Etawah','Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad',
    'Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Jaunpur','Jhansi',
    'Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kushinagar','Lakhimpur Kheri','Lalitpur','Lucknow','Maharajganj',
    'Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh',
    'Prayagraj','Raebareli','Rampur','Saharanpur','Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shrawasti','Siddharthnagar',
    'Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'
  ],
  'Madhya Pradesh': [
    'Agar Malwa','Alirajpur','Anuppur','Ashoknagar','Balaghat','Barwani','Betul','Bhind','Bhopal','Burhanpur',
    'Chhatarpur','Chhindwara','Damoh','Datia','Dewas','Dhar','Dindori','Guna','Gwalior','Harda',
    'Hoshangabad','Indore','Jabalpur','Jhabua','Katni','Khandwa','Khargone','Mandla','Mandsaur','Morena',
    'Narsinghpur','Neemuch','Niwari','Panna','Raisen','Rajgarh','Ratlam','Rewa','Sagar','Satna',
    'Sehore','Seoni','Shahdol','Shajapur','Sheopur','Shivpuri','Sidhi','Singrauli','Tikamgarh','Ujjain',
    'Umaria','Vidisha','Mauganj','Pandhurna','Maihar'
  ],
  'Maharashtra': [
    'Ahmednagar','Akola','Amravati','Aurangabad','Beed','Bhandara','Buldhana','Chandrapur','Dhule','Gadchiroli',
    'Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded',
    'Nandurbar','Nashik','Osmanabad','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara',
    'Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal'
  ],
  'Karnataka': [
    'Bagalkot','Ballari','Belagavi','Bengaluru Rural','Bengaluru Urban','Bidar','Chamarajanagar','Chikballapur','Chikkamagaluru','Chitradurga',
    'Dakshina Kannada','Davanagere','Dharwad','Gadag','Hassan','Haveri','Kalaburagi','Kodagu','Kolar','Koppal',
    'Mandya','Mysuru','Raichur','Ramanagara','Shivamogga','Tumakuru','Udupi','Uttara Kannada','Vijayapura','Vijayanagara',
    'Yadgir'
  ],
  'Rajasthan': [
    'Ajmer','Alwar','Banswara','Baran','Barmer','Bharatpur','Bhilwara','Bikaner','Bundi','Chittorgarh',
    'Churu','Dausa','Dholpur','Dungarpur','Hanumangarh','Jaipur','Jaisalmer','Jalore','Jhalawar','Jhunjhunu',
    'Jodhpur','Karauli','Kota','Nagaur','Pali','Pratapgarh','Rajsamand','Sawai Madhopur','Sikar','Sirohi',
    'Sri Ganganagar','Tonk','Udaipur'
  ],
  'Tamil Nadu': [
    'Ariyalur','Chengalpattu','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kallakurichi','Kanchipuram',
    'Kanyakumari','Karur','Krishnagiri','Madurai','Mayiladuthurai','Nagapattinam','Namakkal','Nilgiris','Perambalur','Pudukkottai',
    'Ramanathapuram','Ranipet','Salem','Sivaganga','Tenkasi','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli',
    'Tirupathur','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar'
  ],
  'Andhra Pradesh': [
    'Anakapalli','Anantapur','Annamayya','Bapatla','Chittoor','East Godavari','Eluru','Guntur','Kakinada','Konaseema',
    'Krishna','Kurnool','Nandyal','NTR','Palnadu','Parvathipuram Manyam','Prakasam','Sri Potti Sriramulu Nellore','Sri Sathya Sai','Srikakulam',
    'Tirupati','Visakhapatnam','Vizianagaram','West Godavari','YSR Kadapa','Alluri Sitharama Raju'
  ],
  'Bihar': [
    'Araria','Arwal','Aurangabad','Banka','Begusarai','Bhagalpur','Bhojpur','Buxar','Darbhanga','East Champaran',
    'Gaya','Gopalganj','Jamui','Jehanabad','Kaimur','Katihar','Khagaria','Kishanganj','Lakhisarai','Madhepura',
    'Madhubani','Munger','Muzaffarpur','Nalanda','Nawada','Patna','Purnia','Rohtas','Saharsa','Samastipur',
    'Saran','Sheikhpura','Sheohar','Sitamarhi','Siwan','Supaul','Vaishali','West Champaran'
  ],
  'Odisha': [
    'Angul','Balangir','Balasore','Bargarh','Bhadrak','Boudh','Cuttack','Deogarh','Dhenkanal','Gajapati',
    'Ganjam','Jagatsinghpur','Jajpur','Jharsuguda','Kalahandi','Kandhamal','Kendrapara','Kendujhar','Khordha','Koraput',
    'Malkangiri','Mayurbhanj','Nabarangpur','Nayagarh','Nuapada','Puri','Rayagada','Sambalpur','Subarnapur','Sundargarh'
  ],
  'Telangana': [
    'Adilabad','Bhadradri Kothagudem','Hanumakonda','Hyderabad','Jagtial','Jangaon','Jayashankar Bhupalpally','Jogulamba Gadwal','Kamareddy','Karimnagar',
    'Khammam','Komaram Bheem','Mahabubabad','Mahabubnagar','Mancherial','Medak','Medchal Malkajgiri','Mulugu','Nagarkurnool','Nalgonda',
    'Narayanpet','Nirmal','Nizamabad','Peddapalli','Rajanna Sircilla','Ranga Reddy','Sangareddy','Siddipet','Suryapet','Vikarabad',
    'Wanaparthy','Warangal','Yadadri Bhuvanagiri'
  ],
  'Chhattisgarh': [
    'Balod','Baloda Bazar','Balrampur','Bastar','Bemetara','Bijapur','Bilaspur','Dantewada','Dhamtari','Durg',
    'Gariaband','Gaurela-Pendra-Marwahi','Janjgir-Champa','Jashpur','Kabirdham','Kanker','Kondagaon','Korba','Koriya','Mahasamund',
    'Mungeli','Narayanpur','Raigarh','Raipur','Rajnandgaon','Sukma','Surajpur','Surguja','Manendragarh','Sarangarh-Bilaigarh',
    'Khairagarh','Mohla-Manpur','Sakti'
  ],
  'Assam': [
    'Baksa','Barpeta','Biswanath','Bongaigaon','Cachar','Charaideo','Chirang','Darrang','Dhemaji','Dhubri',
    'Dibrugarh','Dima Hasao','Goalpara','Golaghat','Hailakandi','Hojai','Jorhat','Kamrup','Kamrup Metropolitan','Karbi Anglong',
    'Karimganj','Kokrajhar','Lakhimpur','Majuli','Morigaon','Nagaon','Nalbari','Sivasagar','Sonitpur','South Salmara-Mankachar',
    'Tinsukia','Udalguri','West Karbi Anglong'
  ],
  'Arunachal Pradesh': [
    'Anjaw','Changlang','Dibang Valley','East Kameng','East Siang','Kamle','Kra Daadi','Kurung Kumey','Lepa Rada','Lohit',
    'Longding','Lower Dibang Valley','Lower Siang','Lower Subansiri','Namsai','Pakke Kessang','Papum Pare','Shi Yomi','Siang','Tawang',
    'Tirap','Upper Siang','Upper Subansiri','West Kameng','West Siang','Itanagar Capital Complex'
  ]
};

let report = [];

for (const [stateName, fullList] of Object.entries(additions)) {
  const stateObj = data.find(s => s.state === stateName);
  if (!stateObj) {
    report.push(`⚠️ State not found: ${stateName}`);
    continue;
  }
  
  const existing = new Set(stateObj.districts);
  const merged = new Set([...stateObj.districts, ...fullList]);
  stateObj.districts = Array.from(merged).sort();
  
  report.push(`${stateName}: ${existing.size} → ${stateObj.districts.length}`);
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(report.join('\n'));
console.log('\n✅ Done! All major states updated.');