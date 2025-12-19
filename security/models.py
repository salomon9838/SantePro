from django.db import models
from django.contrib.auth.models import User
User.objects.all()





class ThemeConfig(models.Model):
    name = models.CharField(max_length=100)
    primary_color = models.CharField(max_length=7, default="#667eea")
    secondary_color = models.CharField(max_length=7, default="#764ba2")

    def __str__(self):
        return self.name


class Patient(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    date_naissance = models.DateField()
    sexe = models.CharField(max_length=10)
    telephone = models.CharField(max_length=20)
    adresse = models.TextField()

    def __str__(self):
        return f"{self.nom} {self.prenom}"


# Définition des Rôles pour l'utilisateur
class Utilisateur(models.Model):
    ROLES = (
        ('MEDECIN', 'Médecin'),
        ('INFIRMIER', 'Infirmier'),
        ('ADMIN', 'Administrateur'),
        ('SECRETAIRE', 'Secrétaire'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Utilisation des choix pour garantir la cohérence des rôles
    role = models.CharField(max_length=50, choices=ROLES)

    def __str__(self):
        return self.user.username


class Pathologie(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.nom


class Consultation(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    # Renommé pour plus de clarté sur la personne responsable
    personnel_responsable = models.ForeignKey(
        Utilisateur, 
        on_delete=models.CASCADE,
        # Ajout d'un related_name pour éviter les conflits
        related_name='consultations_faites'
    ) 
    date_consultation = models.DateTimeField(auto_now_add=True)
    symptomes = models.TextField()
    diagnostic = models.TextField()

    def __str__(self):
        return f"Consultation {self.patient} - {self.date_consultation.strftime('%Y-%m-%d %H:%M')}"


class Prescription(models.Model):
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE)
    medicament = models.CharField(max_length=100)
    posologie = models.CharField(max_length=100)
    duree = models.CharField(max_length=50)

    def __str__(self):
        return f"Prescription pour {self.consultation.patient}: {self.medicament}"


class RegistreMaladie(models.Model):
    pathologie = models.ForeignKey(Pathologie, on_delete=models.CASCADE)
    nombre_cas = models.IntegerField()
    # Utilisation de DateField, plus approprié si vous n'avez besoin que du jour
    date_enregistrement = models.DateField(auto_now_add=True)

    # Ajout d'une contrainte d'unicité
    class Meta:
        unique_together = ('pathologie', 'date_enregistrement')

    def __str__(self):
        return f"{self.pathologie} - {self.nombre_cas} cas ({self.date_enregistrement})"