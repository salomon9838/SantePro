       // Structure de données de l'application
        let patients = [];
        let consultations = [];
        let currentPatient = null;
        let currentPrescription = ''; 
        
        // Structure de données de l'utilisateur (stockées localement)
        let storedUser = JSON.parse(localStorage.getItem('storedUser')) || null;

        // --- Fonctions d'Authentification ---
        function updateStoredUser(user) {
            storedUser = user;
            localStorage.setItem('storedUser', JSON.stringify(user));
        }

        function showAuthScreen() {
            document.getElementById('appContainer').style.display = 'none';
            document.getElementById('authScreen').style.display = 'block';
            document.body.style.alignItems = 'center';
            document.body.style.padding = '0';
            if (storedUser) {
                toggleAuthView('login');
            } else {
                toggleAuthView('register');
            }
        }

        function toggleAuthView(view) {
            document.getElementById('authAlert').innerHTML = '';
            document.getElementById('registerView').classList.add('hidden');
            document.getElementById('loginView').classList.add('hidden');
            
            if (view === 'register') {
                document.getElementById('registerView').classList.remove('hidden');
            } else if (view === 'login') {
                document.getElementById('loginView').classList.remove('hidden');
            }
        }
        
        function clearAuthData() {
            localStorage.removeItem('isLoggedIn');
            showAuthScreen();
            document.getElementById('authAlert').innerHTML = '<div class="alert alert-success">🚪 Déconnexion réussie !</div>';
        }

        function checkAuth() {
            if (localStorage.getItem('isLoggedIn') === 'true' && storedUser) {
                startApp();
            } else {
                showAuthScreen();
            }
        }

        // Gérer la soumission du formulaire de Connexion
        document.getElementById('loginForm').onsubmit = function(e) {
            e.preventDefault();
            const emailOrUsername = document.getElementById('userEmail').value;
            const password = document.getElementById('userPassword').value;
            const alertDiv = document.getElementById('authAlert');

            if (storedUser && 
                (storedUser.email === emailOrUsername || storedUser.username === emailOrUsername) && 
                storedUser.password === password) {
                
                localStorage.setItem('isLoggedIn', 'true');
                alertDiv.innerHTML = '<div class="alert alert-success">✅ Connexion réussie ! Redirection...</div>';
                document.getElementById('loginForm').reset();
                setTimeout(startApp, 1000);
            } else {
                alertDiv.innerHTML = '<div class="alert alert-error">❌ Identifiants incorrects. Veuillez vérifier vos informations ou vous inscrire.</div>';
            }
        };

        // Gérer la soumission du formulaire d'Inscription
        document.getElementById('registerForm').onsubmit = function(e) {
            e.preventDefault();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            const alertDiv = document.getElementById('authAlert');

            if (password !== confirmPassword) {
                alertDiv.innerHTML = '<div class="alert alert-error">❌ Le mot de passe et sa confirmation ne correspondent pas.</div>';
                return;
            }
            
            if (password.length < 6) {
                 alertDiv.innerHTML = '<div class="alert alert-error">❌ Le mot de passe doit contenir au moins 6 caractères.</div>';
                return;
            }

            const newUser = {
                firstName: document.getElementById('regFirstName').value,
                lastName: document.getElementById('regLastName').value,
                username: document.getElementById('regUsername').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                role: document.getElementById('regRole').value,
                service: document.getElementById('regService').value,
                password: password,
            };

            updateStoredUser(newUser);

            alertDiv.innerHTML = '<div class="alert alert-success">✅ Inscription réussie ! Veuillez vous connecter.</div>';
            document.getElementById('registerForm').reset();
            toggleAuthView('login');
        };
        
        // Gérer la soumission du formulaire de Profil
        document.getElementById('profileForm').onsubmit = function(e) {
            e.preventDefault();
            const alertDiv = document.getElementById('profileAlert');
            
            const updatedUser = {
                ...storedUser,
                email: document.getElementById('editEmail').value,
                phone: document.getElementById('editPhone').value,
                // Le rôle et le service sont disabled (lecture seule) donc pas mis à jour par ce formulaire
            };
            
            updateStoredUser(updatedUser);
            
            alertDiv.innerHTML = '<div class="alert alert-success">✅ Profil mis à jour !</div>';
            // Mettre à jour l'info de l'utilisateur dans le header
             document.getElementById('currentUserInfo').textContent = `${storedUser.firstName} ${storedUser.lastName} (${storedUser.role} - ${storedUser.service})`;
             setTimeout(() => alertDiv.innerHTML = '', 3000); // Cacher après 3s
        };
        
        // Gérer la soumission du formulaire de Mot de Passe
        document.getElementById('passwordForm').onsubmit = function(e) {
            e.preventDefault();
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            const alertDiv = document.getElementById('securityAlert');

            if (!storedUser) {
                 alertDiv.innerHTML = '<div class="alert alert-error">❌ Erreur utilisateur. Veuillez vous déconnecter et réessayer.</div>';
                return;
            }

            if (oldPassword !== storedUser.password) {
                alertDiv.innerHTML = '<div class="alert alert-error">❌ L\'ancien mot de passe est incorrect.</div>';
                return;
            }

            if (newPassword !== confirmNewPassword) {
                alertDiv.innerHTML = '<div class="alert alert-error">❌ Le nouveau mot de passe et sa confirmation ne correspondent pas.</div>';
                return;
            }
            
            if (newPassword.length < 6) {
                 alertDiv.innerHTML = '<div class="alert alert-error">❌ Le nouveau mot de passe doit contenir au moins 6 caractères.</div>';
                return;
            }

            // Mise à jour du mot de passe
            const updatedUser = {
                ...storedUser, 
                password: newPassword
            };
            updateStoredUser(updatedUser);
            
            // Réinitialiser le formulaire
            document.getElementById('passwordForm').reset();
            
            alertDiv.innerHTML = '<div class="alert alert-success">✅ Mot de passe mis à jour avec succès ! Veuillez vous reconnecter.</div>';
            
            // Déconnexion forcée après changement de mot de passe pour la sécurité
            setTimeout(clearAuthData, 2000); 
        };

        // --- Fonctions de l'Application ---
        
        function startApp() {
            loadData(); // Charger les données avant d'afficher l'application
            document.getElementById('authScreen').style.display = 'none';
            document.getElementById('appContainer').style.display = 'block';
            document.body.style.alignItems = 'flex-start'; // Alignement normal pour l'application
            document.body.style.padding = '20px'; // Re-appliquer le padding du body

            document.getElementById('currentUserInfo').textContent = `${storedUser.firstName} ${storedUser.lastName} (${storedUser.role} - ${storedUser.service})`;
            document.getElementById('currentServiceDisplay').textContent = storedUser.service;
            document.getElementById('listServiceDisplay').textContent = storedUser.service; // NOUVEAU: Mettre à jour l'affichage dans la liste

            showMainMenu();
            updateStats();
            populateRegistryFilters();
        }

        // --- Fonctions de navigation et de gestion des données ---
        function showSection(sectionId) {
            // Cacher toutes les sections de contenu
            document.querySelectorAll('.content-area').forEach(area => {
                area.classList.remove('active');
            });

            // Cacher le menu principal
            document.getElementById('mainMenu').style.display = 'none';

            // Afficher la section demandée
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
            }

            // Masquer les détails de patient dans l'ancienne consultation si on navigue ailleurs
            if (sectionId !== 'oldConsultation') {
                document.getElementById('patientDetails').classList.add('hidden');
            }

            // Masquer le bouton de bascule des services s'il est résiduel
            const existingBtn = document.getElementById('toggleButtonContainer');
            if (existingBtn) existingBtn.remove();
            
            // NOUVEAU: Logique pour la section 'settings'
            if (sectionId === 'settings') {
                 document.getElementById('settingsMenu').classList.remove('hidden');
                 document.querySelectorAll('#settings .patient-details').forEach(area => {
                    area.classList.add('hidden');
                 });
                 populateProfileForm(); // Remplir le formulaire de profil
            }
            
            // Logique pour la section 'oldConsultation'
            if (sectionId === 'oldConsultation') {
                searchPatients(); // Relancer la recherche pour afficher la liste récente par défaut
            }
            
            // Réinitialiser les champs de l'étape 2 (Prescription) si on y revient
            if (sectionId === 'prescriptionEditor') {
                document.getElementById('prescriptionContent').value = currentPrescription || '';
                document.getElementById('editorAlert').innerHTML = '';
            }
        }

        function showMainMenu() {
            document.querySelectorAll('.content-area').forEach(area => {
                area.classList.remove('active');
            });
            document.getElementById('mainMenu').style.display = 'grid';
            document.getElementById('patientDetails').classList.add('hidden');

            // NOUVEAU: Réinitialiser l'affichage du menu des paramètres
            if(document.getElementById('settingsMenu')) {
                 document.getElementById('settingsMenu').classList.remove('hidden');
                 document.querySelectorAll('#settings .patient-details').forEach(area => {
                    area.classList.add('hidden');
                 });
            }
        }
        
        // Fonction pour afficher une sous-section des paramètres
        function showSettingsSubSection(subSectionId) {
             // Cacher toutes les sous-sections et le menu
             document.getElementById('settingsMenu').classList.add('hidden');
             document.querySelectorAll('#settings .patient-details').forEach(area => {
                area.classList.add('hidden');
             });

             // Afficher la sous-section demandée
             const subSection = document.getElementById(subSectionId);
             if (subSection) {
                 subSection.classList.remove('hidden');
             }
        }
        
        // --- Fonctions de Consultation ---
        
        // Étape 1: Création d'un nouveau patient (ou détection d'un doublon)
        document.getElementById('newPatientForm').onsubmit = function(e) {
            e.preventDefault();
            const patientName = document.getElementById('patientName').value.trim();
            const patientId = patientName.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 10000);
            
            const existingPatient = patients.find(p => p.name.toLowerCase() === patientName.toLowerCase());
            
            const patient = {
                id: patientId,
                name: patientName,
                age: document.getElementById('patientAge').value,
                gender: document.getElementById('patientGender').value,
                profession: document.getElementById('patientProfession').value,
                phone: document.getElementById('patientPhone').value,
                address: document.getElementById('patientAddress').value,
                service: document.getElementById('serviceType').value, // Service d'enregistrement initial
            };
            
            if (existingPatient) {
                const alertDiv = document.getElementById('newConsultAlert');
                alertDiv.innerHTML = `<div class="alert alert-error">⚠️ Le patient "${patient.name}" (ID: ${existingPatient.id}) existe déjà. Veuillez utiliser la section 'Ancienne Consultation' pour continuer son dossier.</div>`;
                setTimeout(() => alertDiv.innerHTML = '', 4000);
                return;
            }

            currentPatient = patient;
            patients.push(patient);
            saveData();

            // Préparer l'éditeur de prescription (Étape 2)
            document.getElementById('currentPatientNameDisplay2').textContent = `${currentPatient.name} (ID: ${currentPatient.id})`;
            document.getElementById('newPatientForm').reset();
            
            // Réinitialiser la variable temporaire de l'étape 2
            currentPrescription = '';

            showSection('prescriptionEditor');
        };

        // NOUVEAU: Gérer la soumission du formulaire de Prescription (Étape 2)
        document.getElementById('prescriptionForm').onsubmit = function(e) {
            e.preventDefault();
            goToSummary();
        };

        // Étape 2: Prescription -> Étape 3: Résumé
        function goToSummary() {
            currentPrescription = document.getElementById('prescriptionContent').value;
            
            // Les champs 'Diagnostic général' et 'Durée du traitement' ne sont plus demandés à cette étape.

            // Préparer le résumé (Étape 3)
            document.getElementById('currentPatientNameDisplay3').textContent = `${currentPatient.name} (ID: ${currentPatient.id})`;

            // Pré-remplir les informations du soignant à partir du profil
            document.getElementById('doctorName').value = `${storedUser.firstName} ${storedUser.lastName}`;
            document.getElementById('doctorContact').value = storedUser.phone || storedUser.email;
            document.getElementById('doctorService').value = storedUser.service;
            document.getElementById('consultationCenter').value = 'Centre de Consultation par défaut (Modifiez si nécessaire)';

            document.getElementById('editorAlert').innerHTML = ''; // Nettoyer les alertes
            showSection('medicalSummary');
        }

        // Étape 3: Sauvegarde de la consultation
        function saveConsultation() {
            if (!currentPatient) {
                alert("Erreur: Le patient actuel n'est pas défini. Veuillez recommencer la consultation.");
                showSection('newConsultation');
                return;
            }
            
            const diseaseType = document.getElementById('diseaseType').value;
            const doctorName = document.getElementById('doctorName').value;
            const doctorService = document.getElementById('doctorService').value;
            const consultationCenter = document.getElementById('consultationCenter').value;
            
            if (!diseaseType || !doctorName || !doctorService || !consultationCenter) {
                alert("Veuillez remplir tous les champs obligatoires du Résumé Médical (marqués par *).");
                return;
            }

            const consultation = {
                id: 'CONS-' + Date.now(),
                patientId: currentPatient.id,
                date: new Date().toISOString().split('T')[0], // Date du jour
                generalDiagnosis: '', // Défini comme vide après suppression du champ
                treatmentDuration: 0, // Défini comme 0 après suppression du champ
                prescriptionContent: currentPrescription,
                disease: diseaseType, // Maladie pour les stats
                observations: document.getElementById('summaryText').value,
                doctorName: doctorName,
                doctorContact: document.getElementById('doctorContact').value,
                service: doctorService,
                center: consultationCenter
            };

            consultations.push(consultation);
            saveData();
            
            currentPatient = null; // Réinitialiser le patient
            currentPrescription = '';

            alert(`✅ Consultation enregistrée pour le patient ${consultation.patientId} !`);
            document.getElementById('medicalSummary').reset();
            showMainMenu();
        }

        // --- Fonctions Ancienne Consultation ---
        
        // MODIFIÉ: Logique de recherche de patients pour correspondre à l'image 2
        function searchPatients() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const listContentDiv = document.getElementById('patientListContent'); // Cibler la zone de contenu interne
            const patientsListContainer = document.querySelector('.patients-list-container');
            
            const serviceDuSoignant = storedUser ? storedUser.service : 'Consultation générale';

            // Mettre à jour le service affiché dans l'en-tête de la liste
            document.getElementById('listServiceDisplay').textContent = serviceDuSoignant;

            // 1. Déterminer les ID des patients vus dans CE service
            const patientIdsInService = new Set(
                consultations
                    .filter(c => c.service === serviceDuSoignant)
                    .map(c => c.patientId)
            );
            
            // 2. Filtrer la liste des patients en fonction de ces IDs
            const patientsInService = patients.filter(p => patientIdsInService.has(p.id));

            // 3. Trie et filtre selon la requête de recherche.
            let patientsToShow = patientsInService.slice().sort((a, b) => {
                 // Trie par la date de la dernière consultation DANS LE SERVICE ACTUEL
                const lastA = consultations.filter(c => c.patientId === a.id && c.service === serviceDuSoignant).sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.date || '1970-01-01';
                const lastB = consultations.filter(c => c.patientId === b.id && c.service === serviceDuSoignant).sort((x, y) => new Date(y.date) - new Date(x.date))[0]?.date || '1970-01-01';
                return new Date(lastB) - new Date(lastA);
            });
            
            if (query.length >= 2) {
                patientsToShow = patientsToShow.filter(p => 
                    p.name.toLowerCase().includes(query) || 
                    p.id.toLowerCase().includes(query) || 
                    (p.phone && p.phone.toLowerCase().includes(query))
                );
            } else {
                // Si la requête est vide, afficher seulement les 10 derniers patients vus dans le service
                patientsToShow = patientsToShow.slice(0, 10);
            }


            if (patientsInService.length === 0) {
                listContentDiv.innerHTML = '<p style="padding: 10px;">Aucun patient consulté dans votre service (ou patient non trouvé).</p>';
                patientsListContainer.style.display = 'block';
            } else {
                const resultsHtml = patientsToShow.map(p => {
                    // Trouver la date de la dernière consultation DANS LE SERVICE ACTUEL
                    const lastConsultation = consultations
                        .filter(c => c.patientId === p.id && c.service === serviceDuSoignant)
                        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                        
                    const lastConsultDate = lastConsultation ? new Date(lastConsultation.date).toLocaleDateString('fr-FR') : 'N/A';
                    
                    return `
                    <div class="patient-search-card" onclick="showPatientDetails('${p.id}')">
                        <div>
                            <a href="#" onclick="event.preventDefault();">${p.name}</a>
                            <small>• ${p.age} ans, ${p.gender === 'M' ? 'Homme' : 'Femme'}</small>
                        </div>
                        <div style="text-align: right;">
                            <small>Dernière consult. : ${lastConsultDate}</small><br>
                            <span style="font-size: 0.85em; color: #495057;">ID: ${p.id}</span>
                        </div>
                    </div>
                    `;
                }).join('');
                listContentDiv.innerHTML = resultsHtml;
                patientsListContainer.style.display = 'block';
            }

            document.getElementById('patientDetails').classList.add('hidden');
        }
        // --- FIN FONCTION MODIFIÉE : Recherche de patients ---


        function showPatientDetails(patientId, showAll = false) {
            currentPatient = patients.find(p => p.id === patientId);

            if (!currentPatient) {
                alert("Patient non trouvé.");
                return;
            }

            document.getElementById('patientDetails').classList.remove('hidden');

            // 1. Afficher les infos patient
            const patientInfoDiv = document.getElementById('patientInfo');
            patientInfoDiv.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label>ID Patient</label>
                        <p>${currentPatient.id}</p>
                    </div>
                    <div class="form-group">
                        <label>Nom Complet</label>
                        <p><strong>${currentPatient.name}</strong></p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Âge</label>
                        <p>${currentPatient.age} ans</p>
                    </div>
                    <div class="form-group">
                        <label>Sexe</label>
                        <p>${currentPatient.gender === 'M' ? 'Masculin' : 'Féminin'}</p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Profession</label>
                        <p>${currentPatient.profession || 'N/A'}</p>
                    </div>
                    <div class="form-group">
                        <label>Téléphone</label>
                        <p>${currentPatient.phone || 'N/A'}</p>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Adresse</label>
                        <p>${currentPatient.address || 'N/A'}</p>
                    </div>
                    <div class="form-group">
                        <label>Service d'Enregistrement Initial</label>
                        <p>${currentPatient.service || 'N/A'}</p>
                    </div>
                </div>
            `;
            
            // Nettoyer le bouton de bascule précédent
            const existingBtn = document.getElementById('toggleButtonContainer');
            if (existingBtn) existingBtn.remove();
            
            // 2. Afficher l'historique (par défaut, filtre par service de l'utilisateur)
            renderHistory(patientId, showAll);
        }

        // Fonction pour afficher l'historique des consultations
        function renderHistory(patientId, showAll) {
            const serviceDuSoignant = storedUser ? storedUser.service : 'Consultation générale';
            const historyDiv = document.getElementById('consultationHistory');

            let patientConsultations = consultations
                .filter(c => c.patientId === patientId)
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // Trie du plus récent au plus ancien

            if (!showAll) {
                patientConsultations = patientConsultations.filter(c => c.service === serviceDuSoignant);
            }
            
            // Rendre l'historique
            let historyHtml = `<h3 class="details-section-header">${showAll ? 'Historique complet des consultations' : `Historique (Service : ${serviceDuSoignant})`} (${patientConsultations.length} résultats)</h3>`;

            if (patientConsultations.length === 0) {
                historyHtml += `<p>Aucune consultation trouvée ${showAll ? '' : `dans le service ${serviceDuSoignant}`}.</p>`;
            } else {
                historyHtml += patientConsultations.map(c => {
                    const isOtherService = c.service !== serviceDuSoignant;
                    const cardClass = `consultation-item-maquette ${isOtherService ? 'other-service' : ''}`;
                    const serviceNote = isOtherService ? `(Service: ${c.service})` : '';
                    
                    const formattedPrescriptionContent = c.prescriptionContent || 'N/A';
                    
                    return `
                    <div class="${cardClass}">
                        <h4>Consultation du ${new Date(c.date).toLocaleDateString('fr-FR')} ${serviceNote} :</h4>
                        
                        <div class="info-line"><strong>• Type de Maladie :</strong> ${c.disease || 'N/A'}</div>

                        <div style="margin-bottom: 8px;">
                            <strong>• Prescription/Notes détaillées :</strong>
                            <div style="margin-top: 5px; border: 1px solid #eee; padding: 5px; white-space: pre-wrap; font-family: monospace;">
                                ${formattedPrescriptionContent}
                            </div>
                        </div>
                        
                        <div class="info-line"><strong>• Observations Utiles :</strong> ${c.observations || 'N/A'}</div>
                        
                        <hr style="margin: 10px 0; border: 0; border-top: 1px dashed #ccc;">

                        <div class="info-line"><strong>• Soignant :</strong> ${c.doctorName || 'N/A'}</div>
                        
                        <div class="info-line"><strong>• Contact du Soignant :</strong> ${c.doctorContact || 'N/A'}</div>
                        
                        <div class="info-line"><strong>• Service (Cons.) :</strong> ${c.service || 'N/A'}</div>
                        
                        <div class="info-line"><strong>• Centre :</strong> ${c.center || 'N/A'}</div>
                    </div>
                    `;
                }).join('')
            }
            
            historyDiv.innerHTML = historyHtml;

            // 4. Ajouter le bouton de bascule
            const existingBtn = document.getElementById('toggleButtonContainer');
            if (existingBtn) existingBtn.remove(); // Supprimer l'ancien bouton s'il existe

            if (consultations.filter(c => c.patientId === patientId && c.service !== serviceDuSoignant).length > 0) {
                const toggleButtonContainer = document.createElement('div');
                toggleButtonContainer.id = 'toggleButtonContainer';
                toggleButtonContainer.style.textAlign = 'center';
                toggleButtonContainer.style.marginTop = '20px';

                let buttonHtml = '';
                if (showAll) {
                    buttonHtml = `<button class="btn btn-secondary" style="width: auto;" onclick="renderHistory('${patientId}', false)">
                        ✖️ Cacher les consultations d'autres services
                    </button>`;
                } else {
                     buttonHtml = `<button class="btn btn-secondary" style="width: auto;" onclick="renderHistory('${patientId}', true)">
                        👀 Afficher toutes les consultations (y compris autres services)
                    </button>`;
                }
                toggleButtonContainer.innerHTML = buttonHtml;
                historyDiv.parentNode.insertBefore(toggleButtonContainer, historyDiv.nextSibling); // Insère après le div d'historique
            }
        }
        
        // Continuer consultation (Va à l'étape 2)
        function continueConsultation() {
            document.getElementById('currentPatientNameDisplay2').textContent = `${currentPatient.name} (ID: ${currentPatient.id})`;
            
            // Réinitialiser les champs de l'étape 2
            currentPrescription = '';
            document.getElementById('prescriptionContent').value = '';
            
            showSection('prescriptionEditor');
        }

        // --- Fonctions de l'éditeur de prescription (Ajouter tableau et section) ---
        function addTable() {
            const contentArea = document.getElementById('prescriptionContent');
            let columns = parseInt(prompt("Entrez le nombre de colonnes (max 4):", 3)) || 3;
            let rows = parseInt(prompt("Entrez le nombre de lignes (max 10):", 4)) || 4;

            if (isNaN(columns) || columns < 1 || columns > 4) {
                alert("Nombre de colonnes invalide. Le tableau aura 3 colonnes par défaut.");
                columns = 3;
            }
            if (isNaN(rows) || rows < 1 || rows > 10) {
                alert("Nombre de lignes invalide. Le tableau aura 4 lignes par défaut.");
                rows = 4;
            }

            // Largeur de la cellule : 60 caractères disponibles au total
            const totalWidth = 60;
            // cellWidth est la largeur interne, déduction faite des 2 espaces de padding et des bordures.
            const cellWidth = Math.floor(totalWidth / columns) - 2; 

            let tableContent = '\n';
            
            // Fonction pour créer une ligne de séparation
            const createSeparator = (cols) => {
                let sep = '+';
                for (let i = 0; i < cols; i++) {
                    sep += '-'.repeat(cellWidth + 2) + '+';
                }
                return sep;
            };

            // Fonction pour créer le contenu d'une ligne
            const createRow = (cols, isHeader = false, rowNum = 0) => {
                let row = '|';
                for (let i = 0; i < cols; i++) {
                    let cellContent;
                    if (isHeader) {
                        cellContent = `TITRE ${i + 1}`;
                    } else {
                        cellContent = `Ligne ${rowNum}, Colonne ${i + 1}`;
                    }
                    
                    // Tronquer ou padder le contenu
                    if (cellContent.length > cellWidth) {
                        cellContent = cellContent.substring(0, cellWidth);
                    } else {
                        const padding = ' '.repeat(cellWidth - cellContent.length);
                        cellContent = cellContent + padding;
                    }

                    row += ` ${cellContent} |`;
                }
                return row;
            };

            // Construction du tableau
            tableContent += createSeparator(columns) + '\n';
            tableContent += createRow(columns, true) + '\n'; // En-tête
            tableContent += createSeparator(columns) + '\n';
            
            for (let i = 1; i <= rows; i++) {
                tableContent += createRow(columns, false, i) + '\n'; // Ligne de données
            }
            
            tableContent += createSeparator(columns) + '\n';
            
            contentArea.value += tableContent;
        }

        function addSection() {
            const contentArea = document.getElementById('prescriptionContent');
            const sectionTitle = prompt("Entrez le titre de la nouvelle section:", "SUIVI MÉDICAL");
            if (sectionTitle) {
                const newSection = `\n\n--- ${sectionTitle.toUpperCase()} ---\n\n`;
                contentArea.value += newSection;
            }
        }

        // --- Fonctions Registre ---
        
        /**
         * Rempli les listes déroulantes de filtres du registre avec les données existantes.
         */
        function populateRegistryFilters() {
            // Centres
            const uniqueCenters = new Set(consultations.map(c => c.center).filter(Boolean));
            const centerFilter = document.getElementById('centerFilter');
            centerFilter.innerHTML = '<option value="all">Tous les centres</option>';
            uniqueCenters.forEach(center => {
                centerFilter.innerHTML += `<option value="${center}">${center}</option>`;
            });

            // Services
            // Re-génération de la liste complète des services pour le filtre
            const allServices = [
                'Urgences', 'Consultation générale', 'Médecine Interne', 'Cardiologie', 'Pneumologie', 
                'Rhumatologie', 'Neurologie', 'Néphrologie', 'Dermatologie', 'Hématologie', 
                'Pédiatrie', 'Traumatologie', 'Urologie', 'Anesthésie-Réanimation', 'Ophtalmologie', 
                'Radiologie/Imagerie médicale', 'Anatomo-pathologie', 'Odontologie/Stomatologie', 
                'Gynécologie', 'Laboratoire', 'Kinésithérapie', 'Optométrie', 'Sage-femme/Obstétrique', 
                'ORL', 'Psychiatrie', 'Gastroentérologie', 'Neurochirurgie', 'Infertilité', 
                'Chirurgie générale', 'Chirurgie pédiatrique', 'Chirurgie Viscérale', 
                'Réanimation médicale et polysalle', 'Scanner', 'Transfusion sanguine', 'Administration', 'Autre'
            ];
            
            const serviceFilter = document.getElementById('serviceFilter');
            serviceFilter.innerHTML = '<option value="all">Tous les services</option>';
            allServices.forEach(service => {
                serviceFilter.innerHTML += `<option value="${service}">${service}</option>`;
            });
            // Assurez-vous que les services réellement utilisés sont présents dans la liste (ce qui est le cas avec la liste complète)
        }

        /**
         * Met à jour les statistiques et le tableau des maladies dans la vue Registre.
         */
        function updateStats() {
            const diseaseSearch = document.getElementById('diseaseSearchInput').value.toLowerCase();
            const dateStart = document.getElementById('dateFilterStart').value;
            const dateEnd = document.getElementById('dateFilterEnd').value;
            const centerFilterValue = document.getElementById('centerFilter').value;
            const serviceFilterValue = document.getElementById('serviceFilter').value;
            
            // 1. Filtrer les consultations
            let filteredConsultations = consultations.filter(c => {
                const consultDate = new Date(c.date);
                
                // Filtre par nom de maladie
                if (diseaseSearch && !c.disease.toLowerCase().includes(diseaseSearch)) {
                    return false;
                }
                
                // Filtre par date de début
                if (dateStart && consultDate < new Date(dateStart)) {
                    return false;
                }
                
                // Filtre par date de fin
                if (dateEnd) {
                    // Ajouter un jour pour inclure la date de fin dans la période
                    const endDate = new Date(dateEnd);
                    endDate.setDate(endDate.getDate() + 1); 
                    if (consultDate >= endDate) {
                        return false;
                    }
                }
                
                // Filtre par centre
                if (centerFilterValue !== 'all' && c.center !== centerFilterValue) {
                    return false;
                }
                
                // Filtre par service
                if (serviceFilterValue !== 'all' && c.service !== serviceFilterValue) {
                    return false;
                }

                return true;
            });
            
            // 2. Calculer les statistiques
            const totalConsultations = filteredConsultations.length;
            const urgencesCount = filteredConsultations.filter(c => c.service === 'Urgences').length;
            
            const patientIds = new Set(filteredConsultations.map(c => c.patientId));
            const totalPatients = patientIds.size;

            // 3. Afficher le résumé
            document.getElementById('totalPatients').textContent = totalPatients;
            document.getElementById('totalConsultations').textContent = totalConsultations;
            document.getElementById('urgencesCount').textContent = urgencesCount;

            // 4. Calculer le nombre de consultations par maladie
            const diseaseCount = {};
            const diseaseServiceMap = {}; // Pour stocker le service et le centre pour l'affichage
            
            filteredConsultations.forEach(c => {
                const normalizedDisease = c.disease.trim().toUpperCase();
                diseaseCount[normalizedDisease] = (diseaseCount[normalizedDisease] || 0) + 1;
                 // Stocker le service et le centre de la dernière consultation pour le tableau si c'est la première fois qu'on voit cette maladie
                if (!diseaseServiceMap[normalizedDisease]) {
                     diseaseServiceMap[normalizedDisease] = { service: c.service, center: c.center };
                }
            });

            const diseaseStatsDiv = document.getElementById('diseaseStats');
            const sortedDiseases = Object.entries(diseaseCount)
                .sort(([, a], [, b]) => b - a);
                
            // --- 5. Construction du tableau ASCII (Top 10 Maladies) ---
            let tableContent = '';
            
            // Ajuster les largeurs pour correspondre à la taille du PRE (environ 59-60)
            const col1Width = 20; // Maladie
            const col2Width = 14; // Total Patients
            const col3Width = 10; // Service
            const col4Width = 10; // Centre
            const totalWidth = col1Width + col2Width + col3Width + col4Width + 5; // Longueur totale de la ligne

            const createSeparator = () => {
                return '<span class="separator">|' + '-'.repeat(col1Width) + '+' + '-'.repeat(col2Width) + '+' + '-'.repeat(col3Width) + '+' + '-'.repeat(col4Width) + '|</span>\n';
            };

            if (sortedDiseases.length === 0) {
                 tableContent = '<p style="text-align: center; padding: 10px;">Aucune donnée de consultation ne correspond aux filtres actuels.</p>';
            } else {
                // Ligne d'en-tête
                tableContent += createSeparator();
                tableContent += '| Maladie' + ' '.repeat(col1Width - 7);
                tableContent += '| Total Consults' + ' '.repeat(col2Width - 14);
                tableContent += '| Service' + ' '.repeat(col3Width - 7);
                tableContent += '| Centre' + ' '.repeat(col4Width - 6) + '|\n';
                tableContent += createSeparator();

                // Lignes de données (Top 10)
                sortedDiseases.slice(0, 10).forEach(([disease, count]) => {
                    const info = diseaseServiceMap[disease] || {};
                    
                    const maladieDisplay = disease.length > col1Width ? disease.substring(0, col1Width - 1) + '.' : disease + ' '.repeat(col1Width - disease.length);
                    const countDisplay = String(count) + ' '.repeat(col2Width - String(count).length);
                    const serviceDisplay = (info.service && info.service.length > col3Width ? info.service.substring(0, col3Width - 1) + '.' : info.service || 'N/A') + ' '.repeat(col3Width - ((info.service && info.service.length > col3Width) ? col3Width : (info.service || 'N/A').length));
                    const centerDisplay = (info.center && info.center.length > col4Width ? info.center.substring(0, col4Width - 1) + '.' : info.center || 'N/A') + ' '.repeat(col4Width - ((info.center && info.center.length > col4Width) ? col4Width : (info.center || 'N/A').length));


                    tableContent += `| ${maladieDisplay} | ${countDisplay} | ${serviceDisplay} | ${centerDisplay} |\n`;
                });
                
                tableContent += createSeparator();
            }

            diseaseStatsDiv.innerHTML = `<pre style="margin: 0; padding: 0; background: none; color: inherit; font-size: 1em; white-space: pre; font-family: 'Courier New', monospace;">${tableContent}</pre>`;
        }
        
        // Sauvegarde et chargement des données
        function saveData() {
            const data = {patients, consultations};
            localStorage.setItem('medicalData', JSON.stringify(data));
            
            // Après sauvegarde, on met à jour les stats et les filtres
            updateStats();
            populateRegistryFilters();
        }

        function loadData() {
            const saved = localStorage.getItem('medicalData');
            if (saved) {
                const data = JSON.parse(saved);
                patients = data.patients || [];
                // Assurez-vous que les anciennes consultations ont les nouveaux champs
                consultations = (data.consultations || []).map(c => ({
                    ...c, 
                    observations: c.summary || c.observations,
                    doctorContact: c.doctorContact || '', // Ajouter les nouveaux champs de Résumé Médical s'ils manquent (pour compatibilité)
                    generalDiagnosis: c.generalDiagnosis || '', // Maintenir le champ pour l'affichage de l'historique
                    treatmentDuration: c.treatmentDuration || 0, // Maintenir le champ pour l'affichage de l'historique
                }));
            }
        }

        // --- Fonctions d'exportation CSV ---
        
        /**
         * Assainit une chaîne de caractères pour l'utiliser dans un champ CSV (point-virgule).
         * @param {string} value - La valeur du champ.
         * @returns {string} - La valeur assainie.
         */
        function sanitizeCsvField(value) {
            if (value === null || value === undefined) return '';
            let str = String(value).trim();
            
            // Échapper les guillemets en les doublant
            str = str.replace(/"/g, '""');
            
            // Si la chaîne contient le séparateur (;) ou des sauts de ligne ou des guillemets, l'entourer de guillemets doubles
            if (str.includes(';') || str.includes('\n') || str.includes('"')) {
                str = `"${str}"`;
            }
            return str;
        }
        
        /**
         * Convertit les données statistiques (Maladie, Total Consultations) en format CSV.
         * @param {Array<Array>} statsList - Liste des entrées de statistiques triées ([maladie, count]).
         * @param {Object} diseaseServiceMap - Map contenant les informations de service/centre pour chaque maladie.
         * @returns {string} - Le contenu CSV.
         */
        function convertStatsToCsv(statsList, diseaseServiceMap) {
            let csvContent = "Maladie;Total_Consultations;Service_Exemple;Centre_Exemple\n";

            statsList.forEach(([disease, count]) => {
                const info = diseaseServiceMap[disease] || {};
                
                const line = [
                    sanitizeCsvField(disease),
                    sanitizeCsvField(count),
                    sanitizeCsvField(info.service || 'N/A'),
                    sanitizeCsvField(info.center || 'N/A'),
                ].join(';');
                csvContent += line + '\n';
            });

            return csvContent;
        }

        /**
         * Lance le téléchargement des données au format CSV.
         * MODIFIÉ: Exporte les statistiques agrégées du Top Maladies.
         */
        function exportData() {
            // Réappliquer la logique de filtrage et d'agrégation de updateStats()
            const diseaseSearch = document.getElementById('diseaseSearchInput').value.toLowerCase();
            const dateStart = document.getElementById('dateFilterStart').value;
            const dateEnd = document.getElementById('dateFilterEnd').value;
            const centerFilterValue = document.getElementById('centerFilter').value;
            const serviceFilterValue = document.getElementById('serviceFilter').value;
            
            let filteredConsultations = consultations.filter(c => {
                const consultDate = new Date(c.date);
                
                // Filtre par nom de maladie
                if (diseaseSearch && !c.disease.toLowerCase().includes(diseaseSearch)) {
                    return false;
                }
                
                // Filtre par date de début
                if (dateStart && consultDate < new Date(dateStart)) {
                    return false;
                }
                
                // Filtre par date de fin
                if (dateEnd) {
                    // Ajouter un jour pour inclure la date de fin dans la période
                    const endDate = new Date(dateEnd);
                    endDate.setDate(endDate.getDate() + 1); 
                    if (consultDate >= endDate) {
                        return false;
                    }
                }
                
                // Filtre par centre
                if (centerFilterValue !== 'all' && c.center !== centerFilterValue) {
                    return false;
                }
                
                // Filtre par service
                if (serviceFilterValue !== 'all' && c.service !== serviceFilterValue) {
                    return false;
                }

                return true;
            });

            if (filteredConsultations.length === 0) {
                alert("Aucune consultation ne correspond aux filtres pour l'exportation.");
                return;
            }

            // Calculer le nombre de consultations par maladie (Agrégation)
            const diseaseCount = {};
            const diseaseServiceMap = {}; 
            
            filteredConsultations.forEach(c => {
                const normalizedDisease = c.disease.trim().toUpperCase();
                diseaseCount[normalizedDisease] = (diseaseCount[normalizedDisease] || 0) + 1;
                if (!diseaseServiceMap[normalizedDisease]) {
                     diseaseServiceMap[normalizedDisease] = { service: c.service, center: c.center };
                }
            });

            const sortedDiseases = Object.entries(diseaseCount)
                .sort(([, a], [, b]) => b - a);
            
            // CONVERSION EN CSV
            const csvContent = convertStatsToCsv(sortedDiseases, diseaseServiceMap);

            // Exportation du fichier
            const BOM = "\uFEFF"; 
            const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'statistiques_maladies_filtrees_' + new Date().toISOString().split('T')[0] + '.csv';
            a.click();
            
            URL.revokeObjectURL(url);
        }

        // --- Fonctions Paramètres (Settings) ---
        function populateProfileForm() {
            if (!storedUser) return;
            document.getElementById('editFirstName').value = storedUser.firstName || '';
            document.getElementById('editLastName').value = storedUser.lastName || '';
            document.getElementById('editUsername').value = storedUser.username || '';
            document.getElementById('editEmail').value = storedUser.email || '';
            document.getElementById('editPhone').value = storedUser.phone || '';
            document.getElementById('editRole').value = storedUser.role || 'Autre';
            document.getElementById('editService').value = storedUser.service || 'Autre';
            document.getElementById('profileAlert').innerHTML = '';
        }
        
        // --- Initialisation ---
        window.onload = checkAuth;
