"""
auth_app/views.py
Vista de login que valida contra la tabla 'usuario' usando bcrypt.
Devuelve un JWT propio (access + refresh).
"""
import bcrypt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario


def _get_tokens_for_user(usuario):
    """Genera un par de tokens JWT para el usuario personalizado."""
    refresh = RefreshToken()
    refresh['user_id']  = usuario.id
    refresh['correo']   = usuario.correo
    refresh['nombre']   = usuario.nombre
    refresh['estatus']  = usuario.fk_estatus

    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }


class LoginView(APIView):
    """
    POST /api/auth/login/
    Body: { "correo": "...", "password": "..." }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        correo   = request.data.get('correo', '').strip().lower()
        password = request.data.get('password', '')

        if not correo or not password:
            return Response(
                {'detail': 'Correo y contraseña son requeridos.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            usuario = Usuario.objects.get(correo__iexact=correo)
        except Usuario.DoesNotExist:
            return Response(
                {'detail': 'Credenciales inválidas.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Validar estatus activo (id=1)
        if usuario.fk_estatus != 1:
            return Response(
                {'detail': 'Usuario inactivo. Contacte al administrador.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Verificar bcrypt
        try:
            password_ok = bcrypt.checkpw(
                password.encode('utf-8'),
                usuario.password_hash.encode('utf-8'),
            )
        except Exception:
            password_ok = False

        if not password_ok:
            return Response(
                {'detail': 'Credenciales inválidas.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        tokens = _get_tokens_for_user(usuario)

        return Response({
            'access':  tokens['access'],
            'refresh': tokens['refresh'],
            'user': {
                'id':     usuario.id,
                'nombre': usuario.nombre,
                'correo': usuario.correo,
            },
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    GET /api/auth/me/
    Devuelve datos básicos del usuario autenticado (requiere Bearer token).
    """
    def get(self, request):
        # El token JWT lleva user_id en el payload
        payload = request.auth.payload if request.auth else {}
        return Response({
            'user_id': payload.get('user_id'),
            'correo':  payload.get('correo'),
            'nombre':  payload.get('nombre'),
        })
