from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import exceptions
from auth_app.models import Usuario

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        if not user_id:
            return None
            
        try:
            user = Usuario.objects.get(id=user_id)
        except Usuario.DoesNotExist:
            raise exceptions.AuthenticationFailed('Usuario no encontrado.', code='user_not_found')

        # Add properties that Django/DRF expect on request.user
        user.is_authenticated = True
        user.is_anonymous = False
        
        # Mapear estatus: 1 = Activo, 2 = Inactivo (u otros)
        # SimpleJWT o Django a veces chequea is_active
        user.is_active = (user.fk_estatus == 1)
        
        if not user.is_active:
            raise exceptions.AuthenticationFailed('Usuario inactivo.', code='user_inactive')
            
        return user
