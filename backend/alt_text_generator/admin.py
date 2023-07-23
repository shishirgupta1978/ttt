from django.contrib import admin
from .models import Figure,Document



class FigureInline(admin.StackedInline):
    model = Figure
 

class DocumentAdmin(admin.ModelAdmin):
    inlines = [FigureInline]
    

    list_display = ["id", "created_by","date_created"]
    



class FigureAdmin(admin.ModelAdmin):
    list_display = ["id","get_document_name","number", "alt_text1", "alt_text2","is_alt_text1_selected"]

    def get_document_name(self, obj):
        return obj.document.name
        
    get_document_name.short_description = 'Name'


admin.site.register(Figure,FigureAdmin)

admin.site.register(Document,DocumentAdmin)