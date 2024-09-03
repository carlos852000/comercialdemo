export class Constantes {
    public static NOM_SISTEM: any = 'SisComercial'
    public static CODIGO_ERROR_TOKEN_EXPIRED: any = 401;
    public static CODIGO_ERROR_BAD_REQUEST: any = 400;
    public static CODIGO_ERROR_INTERNAL_SERVER_ERROR: any = 500;

    public static SNACKBAR_TIME = 5000;
    public static PIE_PAGINA = this.NOM_SISTEM+' @Todos los derechos reservados. ZMRSoftware';

    //Estados Compra
    public static EST_ENPROCESO = 'TENPROCESO';
    public static EST_REGISTRADO = 'TREGISTRADO';
    public static EST_APROBADO = 'TREGISTRADO';

    public static ICONOS_MENU = [
        {'name':'Anotación 01','icon':'icReceipt'},
        {'name':'Anotación 02','icon':'icAssigment'},
        {'name':'Ayuda','icon':'icHelp'},
        {'name':'Calendario','icon':'icDateRange'},
        {'name':'Chat','icon':'icChat'},
        {'name':'Configuración','icon':'icSettings'},
        {'name':'Contactos','icon':'icContacts'},
        {'name':'Correo','icon':'icMail'},
        {'name':'Costos','icon':'icAttachMoney'},
        {'name':'Error','icon':'icError'},
        {'name':'Estrella','icon':'icStar'},
        {'name':'Guía','icon':'icBook'},
        {'name':'Inicio','icon':'icLayers'},
        {'name':'Seguridad','icon':'icLock'},
        {'name':'Soporte','icon':'icContactSupport'},
    ]
}
