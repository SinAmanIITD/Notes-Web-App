from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Note


class AuthFlowTests(APITestCase):
    def test_register_and_login(self):
        resp = self.client.post(
            "/api/auth/register/",
            {"username": "alice", "email": "alice@example.com", "password": "strongpass123"},
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="alice").exists())

        resp = self.client.post("/api/auth/token/", {"username": "alice", "password": "strongpass123"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)

    def test_login_wrong_password_rejected(self):
        User.objects.create_user(username="bob", password="correcthorse")
        resp = self.client.post("/api/auth/token/", {"username": "bob", "password": "wrongpass"})
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)


class NoteCrudTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="alice", password="strongpass123")
        self.other = User.objects.create_user(username="eve", password="strongpass123")
        resp = self.client.post("/api/auth/token/", {"username": "alice", "password": "strongpass123"})
        self.access = resp.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

    def test_unauthenticated_request_rejected(self):
        self.client.credentials()
        resp = self.client.get("/api/notes/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_list_update_delete_note(self):
        resp = self.client.post("/api/notes/", {"title": "Groceries", "content": "milk, eggs"})
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        note_id = resp.data["id"]

        resp = self.client.get("/api/notes/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)

        resp = self.client.patch(f"/api/notes/{note_id}/", {"content": "milk, eggs, bread"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["content"], "milk, eggs, bread")

        resp = self.client.delete(f"/api/notes/{note_id}/")
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Note.objects.filter(id=note_id).count(), 0)

    def test_cannot_access_other_users_notes(self):
        other_note = Note.objects.create(owner=self.other, title="Secret", content="eve's note")

        resp = self.client.get(f"/api/notes/{other_note.id}/")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

        resp = self.client.get("/api/notes/")
        self.assertEqual(len(resp.data), 0)
