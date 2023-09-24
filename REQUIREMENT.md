#### "name": "login"
	"method": "POST"
	"url":  "https://doctor-clinic-app.onrender.com/v1/auth/login"
#### "name": "register",				
	"method": "POST",
	"url": "https://doctor-clinic-app.onrender.com/v1/auth/signup"


#### "name": "get all patients with their state"
	"method": "GET"
    "url": "https://doctor-clinic-app.onrender.com/v1/users/find-all-patients"
#### "name": "edit patient state"
	"method": "PATCH"					
    "url": "https://doctor-clinic-app.onrender.com/v1/users/update-patient-state/:patientId"
#### "name": "create patient state"
	"method": "POST"
    "url": "https://doctor-clinic-app.onrender.com/v1/users/create-patient-state"


### Data shape

#### users
```
_id ObjectId priamry key
name string
email string
password
role 'PATIENT'|'DOCTOR'
```
#### patientstates
```
_id ObjectId priamry key
patientId forign key from users table with role patient
message string
notes string
treatmentSession date 
```
