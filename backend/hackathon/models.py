from django.db import models
from django.utils import timezone


class AppUser(models.Model):
    team_no = models.PositiveIntegerField(unique=True, null=True, blank=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(max_length=254, unique=True, null=True, blank=True)
    phone = models.CharField(max_length=32, unique=True, null=True, blank=True)

    password_salt_b64 = models.CharField(max_length=64)
    password_hash_b64 = models.CharField(max_length=128)
    password_iterations = models.PositiveIntegerField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.username


class AppUserMember(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='members')
    member_id = models.CharField(max_length=64, unique=True, null=True, blank=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=254, null=True, blank=True)
    phone = models.CharField(max_length=32)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'phone'], name='uniq_member_phone_per_team'),
        ]
        indexes = [
            models.Index(fields=['user', 'phone']),
        ]

    def __str__(self) -> str:
        return f'{self.user.username}:{self.phone}'


class AuthSession(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='sessions')
    member = models.ForeignKey(AppUserMember, on_delete=models.CASCADE, related_name='sessions', null=True, blank=True)
    token_hash = models.CharField(max_length=64, unique=True)

    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    revoked_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'expires_at']),
            models.Index(fields=['member', 'expires_at']),
        ]

    def is_valid(self) -> bool:
        if self.revoked_at is not None:
            return False
        return self.expires_at > timezone.now()


class OtpChallenge(models.Model):
    identifier = models.CharField(max_length=255)
    member = models.ForeignKey(AppUserMember, on_delete=models.CASCADE, related_name='otp_challenges', null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField()
    consumed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['identifier', 'expires_at']),
            models.Index(fields=['member', 'expires_at']),
            models.Index(fields=['expires_at']),
        ]

    def is_valid(self) -> bool:
        if self.consumed_at is not None:
            return False
        return self.expires_at > timezone.now()


# Game Models for Sortonym
class Word(models.Model):
    word = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    difficulty_level = models.PositiveSmallIntegerField(default=1)
    audio_file_path = models.CharField(max_length=255, blank=True, default='', null=True)

    def __str__(self) -> str:
        return self.word


class Synonym(models.Model):
    anchor_word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='synonyms')
    synonym_word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='synonym_of')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ['anchor_word', 'synonym_word']

    def __str__(self) -> str:
        return f'{self.anchor_word.word} -> {self.synonym_word.word}'


class Antonym(models.Model):
    anchor_word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='antonyms')
    antonym_word = models.ForeignKey(Word, on_delete=models.CASCADE, related_name='antonym_of')
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ['anchor_word', 'antonym_word']

    def __str__(self) -> str:
        return f'{self.anchor_word.word} <-> {self.antonym_word.word}'


class SortonymRound(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='sortonym_rounds')
    member = models.ForeignKey(AppUserMember, on_delete=models.CASCADE, related_name='sortonym_rounds', null=True, blank=True)
    anchor_word = models.ForeignKey(Word, on_delete=models.CASCADE)
    
    started_at = models.DateTimeField(default=timezone.now)
    completed_at = models.DateTimeField(null=True, blank=True)
    time_limit_seconds = models.PositiveIntegerField(default=60)
    
    score = models.PositiveIntegerField(default=0)
    correct_synonyms = models.PositiveIntegerField(default=0)
    correct_antonyms = models.PositiveIntegerField(default=0)
    
    class Meta:
        db_table = 'hackathon_sortonymround'
    
    def __str__(self) -> str:
        return f'{self.user.username} - {self.anchor_word.word} ({self.score}pts)'


class SortonymScore(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE, related_name='sortonym_scores')
    member = models.ForeignKey(AppUserMember, on_delete=models.CASCADE, related_name='sortonym_scores', null=True, blank=True)
    total_score = models.PositiveIntegerField(default=0)
    rounds_played = models.PositiveIntegerField(default=0)
    best_round_score = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'member']
        db_table = 'hackathon_sortonymscore'

    def __str__(self) -> str:
        return f'{self.user.username} - {self.total_score}pts'

class SortonymWords(models.Model):
    """Maps to existing sortonym_words table"""
    word_id = models.AutoField(primary_key=True)
    anchor_word = models.CharField(max_length=255, unique=True)
    synonym1 = models.CharField(max_length=255, null=True, blank=True)
    synonym2 = models.CharField(max_length=255, null=True, blank=True)
    synonym3 = models.CharField(max_length=255, null=True, blank=True)
    synonym4 = models.CharField(max_length=255, null=True, blank=True)
    antonym1 = models.CharField(max_length=255, null=True, blank=True)
    antonym2 = models.CharField(max_length=255, null=True, blank=True)
    antonym3 = models.CharField(max_length=255, null=True, blank=True)
    antonym4 = models.CharField(max_length=255, null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = 'sortonym_words'
    
    def get_synonyms(self):
        return [w for w in [self.synonym1, self.synonym2, self.synonym3, self.synonym4] if w]
    
    def get_antonyms(self):
        return [w for w in [self.antonym1, self.antonym2, self.antonym3, self.antonym4] if w]
    
    def __str__(self):
        return self.anchor_word


class HackathonGameround(models.Model):
    """Maps to existing hackathon_gameround table"""
    id = models.AutoField(primary_key=True)
    user_id = models.PositiveIntegerField()
    time_taken = models.FloatField(default=0.0)
    score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    anchor_id = models.PositiveIntegerField(null=True, blank=True)
    
    class Meta:
        managed = False
        db_table = 'hackathon_gameround'
    
    def __str__(self):
        return f"Round {self.id} - User {self.user_id} - Score {self.score}"

class GameResults(models.Model):
    result_id = models.AutoField(primary_key=True)

    game_id = models.CharField(max_length=50)
    game_name = models.CharField(max_length=100)
    player_id = models.CharField(max_length=50)

    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)

    duration = models.IntegerField(null=True, blank=True)
    absolute_score = models.IntegerField(null=True, blank=True)

    percentage_score = models.CharField(max_length=50)
    game_session_data = models.TextField(null=True, blank=True)
    words_played = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = "gameresults"

    def __str__(self):
        return f"{self.game_id} | Player {self.player_id} | Score {self.absolute_score}"

